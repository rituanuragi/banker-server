import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateDirectoryDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;  // Full Name of the banker

  @IsNotEmpty()
  @IsString()
  bankName: string;  // Bank Name

  @IsNotEmpty()
  @IsString()
  designation: string;  // Designation

  @IsNotEmpty()
  @IsDateString()
  dateOfJoining: Date;  // Date of Joining in the current bank

  @IsNotEmpty()
  @IsString()
  totalExperience: string;  // Total Experience in 'X years Y months' format

  @IsNotEmpty()
  @IsString()
  contact: string;  // Contact Info (e.g., phone number, email)

  @IsNotEmpty()
  @IsString()
  email: string;  // Contact Info (e.g., phone number, email)

  @IsNotEmpty()
  @IsString()
  location: string;  // Location (e.g., city, address)

  @IsOptional()
  @IsString()
  profileImage?: string;  // Optional Profile Image

  @IsOptional()
  previousExperience?: { 
    company: string;
    role: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }[];  
}
