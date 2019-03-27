export enum ScanMode {
  Progressive = 0,
  Interlaced = 1,
}

export enum MuxType {
  Direct = 0,
  Stripe = 1,
  Checker = 2,
}

export enum PixelMapperType {
  U = 'U-mapper',
  Rotate = 'Rotate',
}

export type PixelMapper
  = { type: PixelMapperType.Rotate; angle: number }
  | { type: PixelMapperType.U };

/**
 * If a runtime option is set to Disabled, it's command line flag will be unavailable.
 */
export enum RuntimeFlag {
  Disabled = -1,
  Off = 0,
  On = 1,
}

export enum RowAddressType {
  /**
   * Corresponds to direct setting of the row.
   */
  Direct = 0,
  /**
   * Used for panels that only have A/B. (typically some 64x64 panels)
   */
  AB = 1,
}

export enum GpioMapping {
  Regular = 'regular',
  AdafruitHat = 'adafruit-hat',
  AdafruitHatPwm = 'adafruit-hat-pwm',
  RegularPi1 = 'regular-pi1',
  Classic = 'classic',
  ClassicPi1 = 'classic-pi1',
}

export interface MatrixOptions {
  /**
   * The type of GPIO mapping of the device.
   * @default GpioMapping.Regular
   */
  hardwareMapping: GpioMapping;

  /**
   * The number of rows supported by a single display panel.
   * @default 32
   */
  rows: 16 | 32 | 64;

  /**
   * The number of columns supported by a single display panel.
   * @default 32
   */
  cols: 16 | 32 | 40 | 64;

  /**
   * The numbr of display panels daisy-chained together.
   * Acts as a multiplier of the total number of columns.
   * @default 1
   */
  chainLength: 1 | 2 | 3 | 4;

  /**
   * The number of parallel chains connected to the Pi.
   * Acts as a multiplier of the total number of rows.
   * @default 1
   */
  parallel: 1 | 2 | 3 | 4;

  /**
   * Set PWM bits used for output. The maximum value is 11. Lower values
   * will increase performance at the expense of color precision.
   * @default 11
   */
  pwmBits: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

  /**
   * Change the base time-unit for the on-time in the lowest
   * significant bit in nanoseconds. Higher values will provide better image quality
   * (more accurate color, less ghosting) at the expense of frame rate.
   * @default 130
   */
  pwmLsbNanoseconds: number;

  /**
   * The lower bits can be time-dithered for higher refresh rate.
   * @default 0
   */
  pwmDitherBits: number;

  /**
   * The initial brightness of the panel in percent.
   * @default 100
   */
  brightness: number;

  /**
   * @default ScanMode.Progressive
   */
  scanMode: ScanMode;

  /**
   * @default RowAddressType.Direct
   */
  rowAddressType: RowAddressType;

  /**
   * @default MuxType.Direct
   */
  multiplexing: MuxType;
  /**
   * Disable the PWM hardware subsystem to create pulses.
   * Typically, you don't want to disable hardware pulsing, this is mostly
   * for debugging and figuring out if there is interference with the
   * sound system.
   * This won't do anything if output enable is not connected to GPIO 18 in
   * non-standard wirings.
   *
   * @default false
   */
  disableHardwarePulsing: boolean;

  /**
   * Print the current refresh rate in real-time to the stderr.
   * @default false
   */
  showRefreshRate: boolean;

  /**
   * In case the internal sequence of mapping is not "RGB", this contains the
   * real mapping. Some panels mix up these colors.
   *
   * @default 'RGB'
   */
  ledRgbSequence: 'RGB' | 'BGR' | 'BRG' | 'RBG' | 'GRB' | 'GBR';

  inverseColors: boolean;

  /**
   * A special string representing selected pixel mappers used to match the
   * current display panel arrangement.
   *
   * Use LedMatrixUtils.encodeMappers() to conventiently get the formatted string from a
   * list of mappers.
   */
  pixelMapperConfig: string;
}

/**
 * Runtime options to simplify doing common things for many programs such as
 * dropping privileges and becoming a daemon.
 */
export interface RuntimeOptions {
  /**
   * @default 0
   */
  gpioSlowdown: number;

  /**
   * If daemon is Disabled, the user has to call StartRefresh() manually
   * once the matrix is created, to leave the decision to become a daemon
   * after the call (which requires that no threads have been started yet).
   * In the other cases (Off or On), the choice is already made, so the thread
   * is conveniently already started for you.
   *
   * @default RuntimeFlag.Off
   */
  daemon: RuntimeFlag;

  /**
   * Drop privileges from 'root' to 'daemon' once the hardware is initialized.
   * This is usually a good idea unless you need to stay on elevated privs.
   *
   * @default RuntimeFlag.On
   */
  dropPrivileges: RuntimeFlag;

  /**
   * By default, the gpio is initialized for you, but if you want to manually
   * do that yourself, set this flag to false.
   * Then, you have to initialize the matrix yourself with SetGPIO().
   *
   * @default true
   */
  doGpioInit: boolean;
}


export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface LedMatrixInstance {
  brightness(brightness: number): this;
  brightness(): number;

  clear(): this;
  clear(x0: number, y0: number, x1: number, y1: number): this;

  drawCircle(x: number, y: number, r: number): this;
  drawLine(x0: number, y0: number, x1: number, y1: number): this;
  drawRect(x0: number, y0: number, x1: number, y1: number): this;
  drawText(text: string, x: number, y: number, kerning?: number): number;

  fill(): this;
  fill(x0: number, y0: number, x1: number, y1: number): this;

  luminanceCorrect(correct: boolean): this;
  luminanceCorrect(): boolean;

  pwmBits(pwmBits: number): this;
  pwmBits(): number;

  bgColor(color: Color): this;
  bgColor(): Color;

  fgColor(color: Color): this;
  fgColor(): Color;

  setFont(font: FontInstance): this;

  setPixel(x: number, y: number): this;

  height(): number;
  width(): number;
}

export interface LedMatrix {
  defaultMatrixOptions(): MatrixOptions;
  defaultRuntimeOptions(): RuntimeOptions;
  new(
    matrixOpts: MatrixOptions,
    runtimeOpts: RuntimeOptions
  ): LedMatrixInstance;
}

export interface FontInstance {
  /**
   * Return the number of pixels from the font's top to its baseline.
   */
  baseline(): number;
  /**
   * Return the number of pixels from the font's top to its bottom.
   */
  height(): number;
  /**
   * Return the number of pixels spanned by a string rendered with this font.
   */
  stringWidth(str: string, kerning?: number): number;
}

export interface Font {
  // tslint:disable-next-line:callable-types
  new (
    path: string
  ): FontInstance;
}

export interface LedMatrixAddon {
  Font: Font;
  LedMatrix: LedMatrix;
}
