import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateDirectoryDto {
  @IsOptional()
  @IsString()
  fullName?: string;  // Full Name of the banker

  @IsOptional()
  @IsString()
  bankName?: string;  // Bank Name

  @IsOptional()
  @IsString()
  designation?: string;  // Designation

  @IsOptional()
  @IsDateString()
  dateOfJoining?: Date;  // Date of Joining in the current bank

  @IsOptional()
  @IsString()
  totalExperience?: string;  // Total Experience in 'X years Y months' format

  @IsOptional()
  @IsString()
  contact?: string;  

  @IsOptional()
  @IsString()
  email?: string;  


  @IsOptional()
  @IsString()
  location?: string;  // Location (e.g., city, address)

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
