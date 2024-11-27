import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: false,
    toObject: {
      getters: true,
      virtuals: false,
    },
  },
})
export class Benefits {
  @prop()
  description: string;

  @prop({ default: false })
  differential: boolean;
}
