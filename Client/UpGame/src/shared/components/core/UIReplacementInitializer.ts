module components.core {

    export class UIReplacementInitializer {

        private _queue: IUIReplacement[] = [];
        private _logics: any[] = [];
        private _callback: Function;
        private _context: any;
        private _index: number = 0;

        public add(replacement: IUIReplacement): UIReplacementInitializer {
            if (!!replacement && this._queue.indexOf(replacement) == -1) {
                this._queue.push(replacement);
            }

            return this;
        }

        public on(callback: Function, context: any): void {
            this._callback = callback;
            this._context = context;

            this.next();
        }

        private next(logic?: any): void {
            if (!!logic && this._logics.indexOf(logic) == -1) {
                this._logics.push(logic);
            }
            if (this._index < this._queue.length) {
                var replacement: IUIReplacement = this._queue.shift();
                replacement.onComplete(this.next, this);
                replacement.init();
            } else {
                if (!!this._callback) this._callback.apply(this._context, [this._logics]);
            }
        }

    }

}