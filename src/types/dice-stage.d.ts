/** Ambient types for the dice-kit custom element. */
export type DiceSettledDetail = {
  result: string;
  sides: number;
  crit: boolean;
  fumble: boolean;
};

export type DiceStageElement = HTMLElement & {
  roll: (opts?: {
    sides?: number;
    result?: string | number;
    theme?: string;
  }) => Promise<string>;
  setTheme: (name: string) => void;
  theme: string;
};

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "dice-stage": React.DetailedHTMLProps<
          React.HTMLAttributes<DiceStageElement> & {
            theme?: string;
            muted?: boolean | "";
          },
          DiceStageElement
        >;
      }
    }
  }
}

export {};
