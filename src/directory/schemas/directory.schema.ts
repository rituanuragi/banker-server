import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Directory extends Document {
  @Prop()
  fullName: string;

  @Prop()
  bankName: string; 
  @Prop()
  designation: string; 

  @Prop()
  dateOfJoining: Date; 
  @Prop()
  totalExperience: string; 

  @Prop()
  contact: string; 

  @Prop({ unique: true })
  email: string; 

  @Prop()
  location: string;  

  @Prop({ required: false })
  profileImage?: string;  

  
  @Prop([{ company: String, role: String, startDate: Date, endDate: Date, description: String }])
  previousExperience: { company: string, role: string, startDate: Date, endDate: Date, description: string }[];  // Array of previous work experiences

}

export const DirectorySchema = SchemaFactory.createForClass(Directory);
