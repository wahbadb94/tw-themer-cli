// all discriminated unions must be composed of variants that have a "tag" property
// this is how typescript can narrow the specific type down.
export interface UnionVariant {
  tag: string;
}

// creates a union of all the tag values of the actual union
type TagUnion<TUnion extends UnionVariant> = TUnion["tag"];

// map of tags to union types
type VariantMap<TUnion extends UnionVariant> = {
  [K in TagUnion<TUnion>]: TUnion extends { tag: K } ? TUnion : never;
};

// map of tag to function that accepts that variant and returns TReturn
export type TaggedHandlers<TUnion extends UnionVariant, TReturn> = {
  [K in keyof VariantMap<TUnion>]: (variant: VariantMap<TUnion>[K]) => TReturn;
};

export type LiteralHandlers<TUnion extends string, TReturn> = {
  [K in TUnion]: (variant: K | void) => TReturn;
};

// class that handles matching on literals
class LiteralMatcher<TUnion extends string> {
  // for some reason the shorthand syntax below breaks in Storybook.
  //
  // constructor(private readonly variant: TUnion) {}

  // but this works fine
  constructor(readonly variant: TUnion) {
    this.variant = variant;
  }

  on<TReturn>(handlers: LiteralHandlers<TUnion, TReturn>): TReturn {
    return handlers[this.variant](this.variant);
  }
}

// class that handles matching on tagged unions
class TaggedMatcher<TUnion extends UnionVariant> {
  constructor(readonly variant: TUnion) {
    this.variant = variant;
  }

  on<TReturn>(handlers: TaggedHandlers<TUnion, TReturn>): TReturn {
    const tag: TagUnion<TUnion> = this.variant.tag;
    return handlers[tag](this.variant as never);
  }
}

// factory funcs that return initialized classes. This is just a convenience to make consuming
// the api a little nicer.
export function matchTagged<TUnion extends UnionVariant>(
  variant: TUnion
): TaggedMatcher<TUnion> {
  return new TaggedMatcher(variant);
}

export function matchLiteral<TUnion extends string>(
  variant: TUnion
): LiteralMatcher<TUnion> {
  return new LiteralMatcher(variant);
}
