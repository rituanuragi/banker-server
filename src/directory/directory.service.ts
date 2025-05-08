import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { Directory } from './schemas/directory.schema';

@Injectable()
export class DirectoryService {
  constructor(
    @InjectModel(Directory.name) private readonly directoryModel: Model<Directory>,
  ) {}

  // Helper function to calculate current experience based on date of joining
  private calculateCurrentExperience(dateOfJoining: Date): string {
    const today = new Date();
    const joinDate = new Date(dateOfJoining);
    const years = today.getFullYear() - joinDate.getFullYear();
    const months = today.getMonth() - joinDate.getMonth();

    const adjustedMonths = months < 0 ? 12 + months : months;
    const adjustedYears = months < 0 ? years - 1 : years;

    return `${adjustedYears} years ${adjustedMonths} months`;
  }

  // Helper function to convert "X years Y months" into total months
  private convertExperienceToMonths(experience: string): number {
    const regex = /(\d+)\s*years?\s*(\d+)\s*months?/;
    const match = experience.match(regex);

    if (!match) {
      throw new BadRequestException('Invalid experience format. Please use "X years Y months".');
    }

    const yearsInMonths = parseInt(match[1]) * 12;  // Convert years to months
    const months = parseInt(match[2]);  // Extract months

    return yearsInMonths + months;
  }

  // Create a new directory entry
  async create(createDirectoryDto: CreateDirectoryDto): Promise<Directory> {
    const { email, dateOfJoining, totalExperience } = createDirectoryDto;
    const existingEmail = await this.directoryModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const currentExperience = this.calculateCurrentExperience(dateOfJoining);
    
    // Ensure that total experience is greater than or equal to current experience
    if (this.convertExperienceToMonths(totalExperience) < this.convertExperienceToMonths(currentExperience)) {
      throw new BadRequestException('Total experience must be greater than or equal to current experience');
    }

    const createdDirectory = new this.directoryModel(createDirectoryDto);
    return createdDirectory.save();
  }

  // Find all profiles with search and filter options
  async findAll(
    searchParams: { bankName?: string; experience?: string; sortBy?: string; sortOrder?: string } = {}
  ): Promise<Directory[]> {
    const { bankName, experience, sortBy = 'dateOfJoining', sortOrder = 'asc' } = searchParams;

    let filter: any = {};

    if (bankName) {
      filter.bankName = { $regex: bankName, $options: 'i' };  // case-insensitive search for bankName
    }

    if (experience) {
      const experienceInMonths = this.convertExperienceToMonths(experience);
      filter.totalExperience = { $gte: experienceInMonths };  // Filter profiles with total experience >= the given value
    }

    let sort: any = {};
    if (sortBy === 'experience') {
      sort = { totalExperience: sortOrder === 'asc' ? 1 : -1 };  // Sort by experience
    } else if (sortBy === 'dateOfJoining') {
      sort = { dateOfJoining: sortOrder === 'asc' ? 1 : -1 };  // Sort by joining date
    }

    return this.directoryModel.find(filter).sort(sort).exec();
  }

  async findOne(id: string): Promise<Directory> {
    const directory = await this.directoryModel.findById(id).exec();
    if (!directory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    return directory;
  }

  async update(
    id: string,
    updateDirectoryDto: UpdateDirectoryDto,
  ): Promise<Directory> {
    const { dateOfJoining, totalExperience } = updateDirectoryDto;

    if (dateOfJoining) {
      const currentExperience = this.calculateCurrentExperience(dateOfJoining);
      
      // Ensure that total experience is greater than or equal to current experience
      if (totalExperience && this.convertExperienceToMonths(totalExperience) < this.convertExperienceToMonths(currentExperience)) {
        throw new BadRequestException('Total experience must be greater than or equal to current experience');
      }
    }

    const updatedDirectory = await this.directoryModel
      .findByIdAndUpdate(id, updateDirectoryDto, { new: true })
      .exec();
    if (!updatedDirectory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    return updatedDirectory;
  }

  async remove(id: string): Promise<Directory> {
    const deletedDirectory = await this.directoryModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedDirectory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    return deletedDirectory;
  }
}
