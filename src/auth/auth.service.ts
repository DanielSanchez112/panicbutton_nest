import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createSupabaseClient } from '../config/supabase.config';
import { PrismaService } from '../prisma.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly supabase;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {
    this.supabase = createSupabaseClient(this.configService);
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password, name, last_name, phone_number } = signUpDto;

    // Check if user already exists in our database
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Encrypt password with bcrypt
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Sign up with Supabase (disable email confirmation for development)
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          email_confirm: true, // Auto-confirm for development
        }
      }
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    // Create user in our database following CreateUserDto structure
    const user = await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword, // Store encrypted password
        name: name || null,
        last_name: last_name || null,
        phone_number: phone_number || null,
        active: true, // Default value as per CreateUserDto
      },
    });

    // Generate JWT
    const payload = { sub: user.id.toString(), email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        active: user.active,
      },
      supabase_user: data.user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Get user from our database (including password for verification)
    const user = await this.prisma.users.findUnique({
      where: { email, active: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Authenticate with Supabase (optional, since we're already validating locally)
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // If Supabase auth fails but local auth succeeds, we can still proceed
      // or you can decide to make Supabase auth mandatory
      console.warn('Supabase authentication failed:', error.message);
    }

    // Generate JWT
    const payload = { sub: user.id.toString(), email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        active: user.active,
      },
      supabase_user: data?.user || null,
    };
  }

  async logout(accessToken: string) {
    // Logout from Supabase
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return { message: 'Logged out successfully' };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { 
        id: BigInt(userId),
        active: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      active: user.active,
      created_at: user.created_at,
    };
  }

  async refreshToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Helper method to validate password
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Helper method to hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Method to change user password
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId), active: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.validatePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await this.hashPassword(newPassword);

    // Update password in database
    await this.prisma.users.update({
      where: { id: BigInt(userId) },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
