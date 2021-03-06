import {MainButton} from './MainButton';
import {Icon, CheckIcon} from './icons';
import {cli} from './ClientStoreManager';

/**
 * A Button controling the reading speed of webrice
 */
export class SpeedButton extends MainButton {
    currentSpeed = 1;
    // NOTE: consider using enumerator for speedSettings;
    speedSettings = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    speedSelectId = 'webriceSelect';
    speedElementClass = 'webriceSpeedElement';
    // eslint-disable-next-line no-invalid-this
    hideSpeedModule = this.closeUnusedSpeedComponents.bind(this);
    checkIcon = new CheckIcon('chosenSpeedChecker', 'checkIcon');

    /**
     *
     * @param {Icon} icon - icon on button
     * @param {string} alt - alt of button
     * @param {string} id - id of button
     * @param {string} title - title of utton
     * @param {string} classes - string containing classes of button
     */
    constructor(icon: Icon, alt: string, id: string,
        title: string) {
      super(icon, alt, id, title);
    }

    /**
     * Replaces the default playback rate with the one in the storage.
     * @return {Promise<void>} change the currentSpeed value
     */
    private async initializePlayback(): Promise<void> {
      const value: number|undefined = await cli.getPlayback();
      if (value) {
        this.setCurrentSpeed(value);
      }
    }

    /**
     * onClick eventlistener to close any open speed menus when another
     * element is clicked while the menu is on display
       * @param {MouseEvent} event - the click that triggered this function
       * @listens
     */
    private closeUnusedSpeedComponents(event: MouseEvent): void {
      const temp = event.target as HTMLElement | SVGElement;
      let isSpeedElement = false;

      // Check if one of the svg paths were clicked since it wasn't possible to
      // add the class to the paths themselves
      const speedPaths = (document.getElementById(this.buttonIcon.svg.id)!)
          .querySelectorAll('path');
      for (let i = 0; i < speedPaths.length; i++) {
        if (temp && temp === speedPaths[i]) {
          isSpeedElement = true;
          return;
        }
      }
      // Then check if any of the speed HTML elements with the class were
      // clicked
      if (temp && temp.classList.contains(this.speedElementClass)) {
        isSpeedElement = true;
        return;
      }
      // Couldn't identify element so now need to close speed components
      if (!isSpeedElement) {
        this.hideReadingSpeeds();
      }
    }

    /**
     * Display or hide the reading speed options depending on the current
     * display option
     */
    toggleReadingSpeedsMenu(): void {
      const readingSpeedsElement = document
          .getElementById(this.speedSelectId) as HTMLUListElement;
      if ( readingSpeedsElement.style.display === 'block') {
        this.hideReadingSpeeds();
      } else {
        (document.getElementById(this.id) as HTMLDivElement)
            .setAttribute('aria-expanded', 'true');
        readingSpeedsElement.style.display = 'block';
        document.addEventListener('click',
            this.hideSpeedModule);
        document.addEventListener('keydown', (e) => {
          this.keyboardCloseUnused(e);
        });
      }
    }

    /**
     *
     * @param {KeyboardEvent} event
     */
    keyboardCloseUnused(event: KeyboardEvent): void {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('webriceSpeedElement')) {
        this.hideReadingSpeeds();
      }
    }

    /**
     * Hide the speed options element
     */
    hideReadingSpeeds(): void {
      const readingSpeedsElement = document
          .getElementById(this.speedSelectId) as HTMLUListElement;
      readingSpeedsElement.style.display = 'none';
      (document.getElementById(this.id) as HTMLDivElement)
          .setAttribute('aria-expanded', 'false');
      // Remove document.eventListener for hiding the speedoptions if anywhere
      // other than the speed stuff is clicked
      document.removeEventListener('click',
          this.hideSpeedModule);
      document.removeEventListener('keydown', (e) => {
        this.keyboardCloseUnused(e);
      });
    }

    /**
     * @return {number} current reading speed
     */
    getCurrentSpeed(): number {
      return this.currentSpeed;
    }

    /**
     * Sets current reading speed for the SpeedButton class
     * @param {number} speed - what current speed will be
     */
    private setCurrentSpeed(speed: number): void {
      cli.setPlayback(speed);
      this.currentSpeed = speed;
      const player = document.getElementById('webricePlayer') as
              HTMLAudioElement;
      player.playbackRate = this.getCurrentSpeed();
    }

    /**
     * Sets the styling and accessibility attributes for the current speed
     * @param {HTMLLIElement} selectedSpeed - what current speed will be
     */
    private setActiveSpeedAttributes(selectedSpeed: HTMLLIElement): void {
      selectedSpeed.setAttribute('aria-checked', 'true');
      selectedSpeed.setAttribute('aria-selected', 'true');
      selectedSpeed.classList.add('active');
      selectedSpeed.appendChild(this.checkIcon.svg);
    }

    /**
     * Sets the styling and accessibility attributes for the other speeds
     * @param {HTMLLIElement} aSpeed - what current speed will be
     */
    private setNonActiveSpeedAttributes(aSpeed: HTMLLIElement): void {
      aSpeed.setAttribute('aria-checked', 'false');
      aSpeed.setAttribute('aria-selected', 'false');
      aSpeed.classList.remove('active');
      const check = document
          .getElementById('chosenSpeedChecker') as HTMLElement;
      if (check) {
        aSpeed.removeChild(check);
      }
    }

    /**
     * Enables user to change reading speed
     * onclick function for each of the speed options
     * Sets current reading speed for the SpeedButton class based on the speed
     * selected and sets it in the audio player's playbackRate
     * Removes the active class from the former speed and adds it to the
     * current speed
     * @param {MouseEvent} event - the click that triggered this function
     * @listens
     */
    public changePlaybackRate(event: MouseEvent|KeyboardEvent): void {
      const selectSpeed = event.target as HTMLLIElement;
      if (selectSpeed && selectSpeed.matches('li')) {
        const newPlaybackRate = Number(selectSpeed.innerText);
        if (newPlaybackRate >= this.speedSettings[0] &&
           newPlaybackRate <= this.speedSettings[this.speedSettings.length-1]) {
          this.setCurrentSpeed(Number(selectSpeed.innerText));
          // remove the active class on the former speed
          this.setNonActiveSpeedAttributes(document.querySelector(
              '#' + this.speedSelectId + ' > li.active') as HTMLLIElement);
          // then put it on the new current speed
          this.setActiveSpeedAttributes(selectSpeed);
        }
      }
    }

    /**
     * Initializes the playback rate and
     * adds the additional html for the speed button group
     * The button group consists of two parts.
     * The first part is the button and the icon.
     * The second part is the list of speed options.
     * @param {HTMLDivElement} button -
     */
    public additionalHTML(button: HTMLDivElement): void {
      // Initializes the playbackrate so it matches what the user chose last
      this.initializePlayback().then(() => {
        // Then we create the HTML
        button.setAttribute('aria-expanded', 'false');
        button.classList.add('webriceSpeedButtonGroup');
        button.classList.add('webriceMainButton');
        button.classList.add(this.speedElementClass);
        this.buttonIcon.svg.classList.add(this.speedElementClass);
        button.appendChild(this.buttonIcon.svg);

        // Create the playbackRate options popup
        const speedOptions = document.createElement('ul');
        speedOptions.classList.add('webriceMainSpeedOptions');
        speedOptions.classList.add(this.speedElementClass);
        speedOptions.id = this.speedSelectId;
        this.speedSettings.forEach( (speed) => {
          const li = document.createElement('li');
          li.appendChild(document.createTextNode(speed.toString()));
          li.setAttribute('tabindex', '0');
          li.title = speed.toString();
          li.setAttribute('role', 'option');
          li.classList.add(this.speedElementClass);
          if (this.getCurrentSpeed() === speed) {
            this.setActiveSpeedAttributes(li);
          } else {
            this.setNonActiveSpeedAttributes(li);
          }
          li.addEventListener('click', (e) => {
            this.changePlaybackRate(e);
          });
          li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.changePlaybackRate(e);
          });
          speedOptions.appendChild(li);
        });
        button.appendChild(speedOptions);
      });
    }
}
