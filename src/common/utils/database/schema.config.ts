export const mongooseSchemaConfig = {
  schemaOptions: {
    id: true,

    versionKey: false,

    timestamps: true,

    autoIndex: true,

    toJSON: {
      virtuals: true,
      transform: (_: any, ret: { _id: any; password: any; salt: any; updatedAt: any; pin: any }) => {
        // TODO: delete all fields not required on the frontend
        delete ret._id;
        delete ret.password;
        delete ret.pin;
        delete ret.salt;
        delete ret.updatedAt;
        return ret;
      },
    },

    toObject: {
      virtuals: true,
      transform: (_: any, ret: { _id: any; password: any; salt: any; updatedAt: any; pin: any }) => {
        delete ret._id;
        delete ret.password;
        delete ret.pin;
        delete ret.salt;
        delete ret.updatedAt;
        return ret;
      },
    },
  },
};
