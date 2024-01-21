import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {Ref, createRef, ref} from 'lit/directives/ref.js';

function shuffle<T>(array: T[]) {
  const clonedArray = [...array];
  let currentIndex = clonedArray.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [clonedArray[currentIndex], clonedArray[randomIndex]] = [
      clonedArray[randomIndex],
      clonedArray[currentIndex],
    ];
  }

  return clonedArray;
}

function widthHeight(square: number) {
  return `width: ${square}px; height: ${square}px`;
}

const styles = css`
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  :host {
    --reelRadius: 80px;
    --reelCount: 4;
  }

  .sm-reel-container {
    position: relative;
    overflow: hidden;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .sm-reel {
    position: absolute;
    border-radius: 100%;
    left: 50%;
    translate: -50%;
    will-change: transform;
    transition: rotate 2s cubic-bezier(0.175, 0.885, 0.32, 1.1);
    box-shadow: 0 0 80px rgba(0, 0, 0, 0.1);

    &.rotating {
      animation: rotate 0.5s linear infinite;
    }

    &.sm-reel-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      top: 50%;
      translate: -50% -50%;
    }

    li {
      --padding: 0.5rem;
      --rotation: 0deg;
      position: absolute;
      padding-top: var(--padding);
      height: calc(100% - var(--padding));
      width: calc(100%);
      text-align: center;
      top: 0;
      rotate: var(--rotation);

      span {
        display: inline-block;
        rotate: calc(-1 * var(--rotation));
        font-size: 20px;
      }
    }
  }

  .sm-selection {
    --padding: 0.5rem;
    width: calc(var(--reelRadius) / 2 * var(--reelCount) + var(--padding) * 2);
    height: 3rem;
    position: absolute;
    top: 50%;
    left: calc(var(--reelRadius) / 2 - var(--padding));
    translate: 0 -50%;
    background-color: #ff000095;
    border-radius: 10rem;
    padding: 0 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    font-size: 32px;
  }
`;

/**
 * An example element.
 *
 * @fires sm-play - Indicates when start slot machine
 * @fires sm-stop-reel - Indicates when the stop a reel at index
 * @fires sm-finish - Indicates when all reels has been stopped
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('slot-machine')
export class SlotMachineElement extends LitElement {
  static override styles = styles;
  /**
   * The name to say "Hello" to.
   */
  @property({type: Array})
  accessor items = [
    '🍋',
    '🍊',
    '🍉',
    '🍈',
    '🍇',
    '🥝',
    '🍓',
    '🍒',
    '🌟',
    '🍀',
    '💎',
    '🎰',
  ];

  @property({type: Number})
  reelRadius = 80;

  @property({type: Number})
  spaceCenterRadius = this.reelRadius * 3;

  @property({type: Number})
  reelCount = 4;

  @state()
  private _reelShuffledItems: Array<typeof this.items> = Array.from(
    {length: this.reelCount},
    () => shuffle(this.items)
  );

  @state()
  private _containerSquare =
    this.reelCount * this.reelRadius + this.spaceCenterRadius;

  @state()
  private _rotatingIndex = -1;

  @state()
  private _reelRefs: Array<Ref<HTMLUListElement>> = [];

  @state()
  private _selectionIndices: number[] = [];

  override render() {
    this._reelRefs = [];
    // this._selectionIndices = [];

    return html`
      <section
        class="sm-reel-container"
        style="${widthHeight(this._containerSquare)}"
      >
        ${Array.from({length: this.reelCount}, (_, index) => {
          const reelRef = createRef<HTMLUListElement>();
          this._reelRefs.push(reelRef);
          return this._renderReel(index, reelRef);
        })}
        <div
          class="sm-reel sm-reel-empty"
          style="${widthHeight(this.spaceCenterRadius / 2)}"
        >
          <slot name="center"></slot>
        </div>

        <!-- ${this._selectionIndices.length === this.reelCount
          ? html`
              <ul class="sm-selection">
                ${this._selectionIndices.map(
                  (selectedIndex, index) =>
                    html`<li>
                      ${this._reelShuffledItems[this.reelCount - 1 - index][
                        selectedIndex
                      ]}
                    </li>`
                )}
              </ul>
            `
          : ''} -->
      </section>
      <button @click=${() => this.play()}>Play</button>
      <button @click=${() => this.stop()}>Stop</button>
    `;
  }

  play() {
    this._rotatingIndex = this.reelCount;
    requestAnimationFrame(() =>
      this._reelRefs.forEach((r) => r.value?.classList.add('rotating'))
    );
    this.dispatchEvent(new CustomEvent('sm-play'));
  }

  stop() {
    this._rotatingIndex--;

    const reelRef = this._reelRefs[this._rotatingIndex];
    if (!reelRef.value) return;
    const firstLi = reelRef.value.querySelector('li span');
    if (!firstLi) return;
    const {x: smX, y: smY, width, height} = this.getBoundingClientRect();
    const centerPoint = {x: smX + width / 2, y: smY + height / 2};
    const {x, y} = firstLi.getBoundingClientRect();
    const angle =
      (Math.atan2(y - centerPoint.y, x - centerPoint.x) * 180) / Math.PI + 180;

    const angleMinUnit = 360 / this.items.length;
    const nextRoundedIndex = Math.ceil(angle / angleMinUnit);
    const stopAtIndex =
      ((this.items.length * 3) / 4 -
        Math.abs(nextRoundedIndex) +
        this.items.length) %
      this.items.length;
    const nextRoundedAngle = nextRoundedIndex * angleMinUnit;

    reelRef.value.classList.remove('rotating');
    reelRef.value.classList.add('slow-down');
    reelRef.value.style.rotate = `${nextRoundedAngle}deg`;

    this._selectionIndices.push(stopAtIndex);

    this.dispatchEvent(new CustomEvent('sm-stop-reel'));
    if (this._rotatingIndex === -1)
      this.dispatchEvent(new CustomEvent('sm-finish'));
  }

  /**
   * Formats a greeting
   * @param name The name to say "Hello" to
   */
  private _renderReel(level: number, reelRef: Ref<HTMLUListElement>) {
    const square = level * this.reelRadius + this.spaceCenterRadius;
    const length = this.items.length;
    const offsetTop = (this._containerSquare - square) / 2;

    return html`
      <ul
        ${ref(reelRef)}
        class="sm-reel"
        style="${widthHeight(square)}; top: ${offsetTop}px;"
      >
        ${this._reelShuffledItems[level].map(
          (item, index) =>
            html`<li style="--rotation: ${(360 / length) * index}deg;">
              <span>${item}</span>
            </li>`
        )}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'slot-machine': SlotMachineElement;
  }
}
