// inspired by https://github.com/jahewson/node-byline
import {
  Readable,
  Transform,
  TransformCallback,
  TransformOptions,
} from "stream";

export class LineStream extends Transform {
  private lineBuffer: string[] = [];
  private lastChunkEndedWithCR;
  private keepEmptyLines;
  private chunkEncoding: BufferEncoding | undefined;
  options = {};
  encoding?: BufferEncoding | null;
  constructor(options?: TransformOptions & { keepEmptyLines: boolean }) {
    super({
      objectMode: true,
      ...options,
    });
    this.options = options || {};

    this.lineBuffer = [];
    this.keepEmptyLines = options?.keepEmptyLines || false;
    this.lastChunkEndedWithCR = false;
    this.chunkEncoding = "utf8";
    // take the source's encoding if we don't have one
    this.on("pipe", (src) => {
      if (!this.encoding) {
        if (src instanceof Readable) {
          this.encoding = src.readableEncoding;
        }
      }
    });
  }
  _transform = (
    chunk: string | Buffer,
    encoding: BufferEncoding | undefined,
    done: TransformCallback
  ) => {
    if (Buffer.isBuffer(chunk)) {
      chunk = chunk.toString();
      encoding = "utf8";
    }
    this.chunkEncoding = encoding;

    // see: http://www.unicode.org/reports/tr18/#Line_Boundaries
    var lines = chunk.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/g);

    if (this.lastChunkEndedWithCR && chunk[0] == "\n") {
      lines.shift();
    }

    if (this.lineBuffer.length > 0) {
      this.lineBuffer[this.lineBuffer.length - 1] += lines[0];
      lines.shift();
    }

    this.lastChunkEndedWithCR = chunk[chunk.length - 1] === "\r";
    this.lineBuffer = this.lineBuffer.concat(lines);
    this.pushBuffer(encoding, 1, done);
  };

  _flush = (done: TransformCallback) => {
    this.pushBuffer(this.chunkEncoding, 0, done);
  };

  private pushBuffer = (encoding: any, keep: number, done: () => void) => {
    while (this.lineBuffer.length > keep) {
      var line = this.lineBuffer.shift();
      if (line) {
        if (this.keepEmptyLines || line.length > 0) {
          this.push(this.reEncode(line));
          setImmediate(() => {
            this.pushBuffer(encoding, keep, done);
          });
          return;
        }
      }
    }
    done();
  };

  private reEncode = (line: string) => {
    if (this.encoding && this.encoding != this.chunkEncoding) {
      return Buffer.from(line, this.chunkEncoding).toString(this.encoding);
    } else if (this.encoding) {
      return line;
    } else {
      return Buffer.from(line, this.chunkEncoding);
    }
  };
}
