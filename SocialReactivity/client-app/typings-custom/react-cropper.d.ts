declare module "react-cropper" {
  import Cropper from "cropperjs";
  import * as React from "react";

  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

  interface ReactCropperProps
    extends Cropper.CropperOptions,
      Omit<React.HTMLProps<HTMLImageElement>, "data" | "ref"> {
    ref?: React.LegacyRef<ReactCropper> | React.RefObject<Cropper>;
  }

  interface ReactCropper extends Cropper {} // tslint:disable-line no-empty-interface
  class ReactCropper extends React.Component<ReactCropperProps> {
    on(eventname: string, callback: () => void): void;
  }
  export default ReactCropper;
}
