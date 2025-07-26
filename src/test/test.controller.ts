import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('test')
@Controller('test')
export class TestController {

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Test public endpoint (no authentication required)' })
  @ApiResponse({ status: 200, description: 'Public endpoint working' })
  getPublic() {
    return { 
      message: 'This is a public endpoint - no authentication required',
      timestamp: new Date().toISOString()
    };
  }

  @ApiBearerAuth('JWT-auth')
  @Get('protected')
  @ApiOperation({ summary: 'Test protected endpoint (authentication required)' })
  @ApiResponse({ status: 200, description: 'Protected endpoint working' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProtected(@CurrentUser() user: any) {
    return { 
      message: 'This is a protected endpoint - authentication required',
      user: user,
      timestamp: new Date().toISOString()
    };
  }

  @ApiBearerAuth('JWT-auth')
  @Post('user-info')
  @ApiOperation({ summary: 'Get detailed user information from token' })
  @ApiResponse({ status: 200, description: 'User information retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserInfo(@CurrentUser() user: any) {
    return {
      message: 'User information from JWT token',
      userFromToken: user,
      explanation: {
        howItWorks: 'The user data comes from the JWT token payload',
        tokenFlow: [
          '1. User logs in with email/password',
          '2. Server creates JWT with user ID in payload',
          '3. Client sends JWT in Authorization header',
          '4. JwtStrategy validates token and calls AuthService.validateUser()',
          '5. AuthService queries database using ID from token',
          '6. Fresh user data is returned and attached to request'
        ]
      },
      timestamp: new Date().toISOString()
    };
  }
}
