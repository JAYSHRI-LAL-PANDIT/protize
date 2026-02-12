declare module "gray-matter" {
  export interface GrayMatterOption {
    excerpt?: boolean | string;
    excerpt_separator?: string;
    delimiters?: string | [string, string];
    language?: string;
    engines?: Record<string, (input: string) => unknown>;
  }

  export interface GrayMatterFile<
    T extends Record<string, unknown> = Record<string, unknown>,
  > {
    data: T;
    content: string;
    excerpt?: string;
    empty?: string;
    isEmpty?: boolean;
    matter: string;
    language: string;
    orig: string;
    stringify(language?: string): string;
  }

  interface GrayMatter {
    <T extends Record<string, unknown> = Record<string, unknown>>(
      input: string | Buffer,
      options?: GrayMatterOption,
    ): GrayMatterFile<T>;

    read<T extends Record<string, unknown> = Record<string, unknown>>(
      filepath: string,
      options?: GrayMatterOption,
    ): GrayMatterFile<T>;

    stringify<T extends Record<string, unknown> = Record<string, unknown>>(
      content: string,
      data?: T,
      options?: GrayMatterOption,
    ): string;

    test(input: string): boolean;
  }

  const matter: GrayMatter;
  export default matter;
}
