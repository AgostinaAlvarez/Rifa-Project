import { ObjectId } from 'mongodb';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Frecuency } from '../utils/enums/planFrecuency.enum';
import { Benefits } from './benefits.model';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
    toObject: {
      getters: true,
      virtuals: false,
    },
  },
})
export class Plans {
  _id: ObjectId;

  @prop({ required: true, unique: true })
  name: string;

  @prop()
  description?: string;

  @prop({ type: [Benefits], _id: false })
  benefits?: Benefits[];

  @prop()
  image?: string;

  @prop({ required: true })
  price: number;

  @prop({ enum: Frecuency, type: () => String, required: true })
  frecuency: Frecuency;

  @prop({ required: true })
  mercadoPagoPlanId: string;
}
