var OTO = OTO || {};

OTO.BubbleGenerator = class {
    constructor(container, options) {
        this.container = container;
        this.options = options;
        this.pointerPos = {
            clientX: 0,
            clientY: 0,
            isMoved: false
        };
        this.bubblesGlassObj = {
            width: 172,
            height: 292,
            XPos: 0,
            YPos: 0,
        }
        this.bubbleElObj = {
            width: 40,
            height: 40
        }
    }

    constructHtml() {
        let bubblesLength = 0;

        if (typeof this.options.bubbles === 'number') {
            bubblesLength = this.options.bubbles;
        } else if (typeof this.options.bubbles === 'string') {
            bubblesLength = parseInt(this.options.bubbles, 10);
            console.warn('Please provide a number value.');
        } else {
            bubblesLength = 10;
        }

        this.container.classList.add('oto-bubbles-generator');

        // Add parallax background
        const bubblesBackground = document.createElement('div');
        bubblesBackground.classList.add('oto-bubbles-background');
        this.container.appendChild(bubblesBackground);

        // Add audio player
        if (this.options.audio === true) {
            const bubblesAudio = document.createElement('audio');
            bubblesAudio.classList.add('oto-bubbles-audio');
            bubblesAudio.autoplay = true;
            bubblesAudio.loop = true;
            bubblesAudio.controls = true;
            bubblesAudio.muted = true;
            bubblesAudio.innerHTML = '<source src="assets/audio/Water Bubble Sound FX Royalty Free Music.mp3" type="audio/mpeg">';
            this.container.appendChild(bubblesAudio);

            const audioPopMessage = document.createElement('div');
            audioPopMessage.classList.add('oto-bubbles-audioPopMessage');
            audioPopMessage.innerHTML = '<p>You can toggle audio by pressing "<b>M</b>" key.</p>';
            document.body.appendChild(audioPopMessage);

            setTimeout(() => {
                audioPopMessage.classList.add('visible');
            }, 1000);

            setTimeout(() => {
                audioPopMessage.classList.remove('visible');
            }, 5000);

            const audioStatus = document.createElement('div');
            audioStatus.classList.add('oto-bubbles-audioStatus');
            document.body.appendChild(audioStatus);

            let hideStatusMessage = null;

            function startHidingStatus() {
                hideStatusMessage = setTimeout(() => {
                    audioStatus.classList.remove('visible');
                }, 2000);
            }

            function resetHidingStatus() {
                clearTimeout(hideStatusMessage);
            }

            document.addEventListener('keypress', function (e) {
                if (e.key === 'm') {
                    bubblesAudio.muted = !bubblesAudio.muted;

                    if (bubblesAudio.muted === true) {
                        audioStatus.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    } else {
                        audioStatus.innerHTML = '<i class="fas fa-volume-up"></i>';
                        bubblesAudio.play();
                    }

                    audioStatus.classList.add('visible');

                    resetHidingStatus();
                    startHidingStatus();
                }
            });
        }

        // Add the wrapper of bubbles
        const bubblesWrapper = document.createElement('div');
        bubblesWrapper.classList.add('oto-bubbles-wrapper');
        this.container.appendChild(bubblesWrapper);

        // Add the Glass
        const bubblesGlass = document.createElement('div');
        bubblesGlass.classList.add('oto-bubbles-glass');
        bubblesGlass.style.width = `${this.bubblesGlassObj.width}px`;
        bubblesGlass.style.height = `${this.bubblesGlassObj.height}px`;
        this.container.appendChild(bubblesGlass);

        // Create bubbles objects
        this.bubblesList = [];
        for (let i = 0; i < bubblesLength; i++) {
            this.bubblesList.push(new OTO.Bubble(this.container.offsetWidth / 2, this.container.offsetHeight - bubblesGlass.offsetHeight));
        }
    }

    // Init Background Image Parallax
    initBackground() {
        const bubblesBackground = this.container.querySelector('.oto-bubbles-background');
        const bubblesWrapper = this.container.querySelector('.oto-bubbles-wrapper');

        let XBgPos = 45;
        let YBgPos = 45;

        bubblesBackground.style.transform = `translate(${-XBgPos}%, ${-YBgPos}%)`;

        this.container.addEventListener('mousemove', e => {
            let XBgPos = 45 + this.pointerPos.clientX / 200;
            let YBgPos = 45 + this.pointerPos.clientY / 200;
            bubblesBackground.style.transform = `translate(${-XBgPos}%, ${-YBgPos}%)`;
        });
    }

    // Init Bubbles Glass
    initBubblesGlass() {
        const _this = this;
        const bubblesBackground = this.container.querySelector('.oto-bubbles-background');
        const bubblesWrapper = this.container.querySelector('.oto-bubbles-wrapper');
        const bubblesGlass = this.container.querySelector('.oto-bubbles-glass');

        _this.setPointerPositionBubblesGlass(_this.bubblesGlassObj);

        bubblesGlass.style.transform = `translate3d(${_this.bubblesGlassObj.XPos}px, ${_this.bubblesGlassObj.YPos}px, 0)`;

        this.container.addEventListener('mousemove', e => {
            _this.setPointerPositionBubblesGlass(_this.bubblesGlassObj);
            bubblesGlass.style.transform = `translate3d(${_this.bubblesGlassObj.XPos}px, ${_this.bubblesGlassObj.YPos}px, 0)`;
        });
    }

    // Init Bubbles
    initBubbles() {
        const _this = this;
        const bubblesBackground = this.container.querySelector('.oto-bubbles-background');
        const bubblesWrapper = this.container.querySelector('.oto-bubbles-wrapper');
        const bubblesGlass = this.container.querySelector('.oto-bubbles-glass');

        for (let i = 0; i < this.bubblesList.length; i++) {
            const bubbleListEl = this.bubblesList[i];
            const bubbleEl = document.createElement('span');
            bubbleEl.classList.add('bubble');
            bubbleEl.style.width = `${this.bubbleElObj.width}px`;
            bubbleEl.style.height = `${this.bubbleElObj.height}px`;

            let XPosC = Math.random() * 3 + 1;
            let XPosT = Math.random() * 4 + 1;

            let YPosC = Math.random() * 1 + 1;
            let YPosT = Math.random() * 4 + 1;

            setTimeout(() => {
                bubblesWrapper.appendChild(bubbleEl);

                bubbleListEl.XPos -= bubbleEl.offsetWidth / 2;
                bubbleListEl.YPos -= bubbleEl.offsetHeight;

                _this.setPointerPositionBubble(bubbleListEl);

                bubbleEl.style.transform = `translate3d(${bubbleListEl.XPos}px, ${bubbleListEl.YPos}px, 0)`;
        
                function animate() {
                    XPosC += 0.038;

                    _this.resetPointerPositionBubble(bubbleListEl);

                    bubbleListEl.XPos += Math.sin(XPosC) * XPosT;
                    bubbleListEl.YPos -= Math.sin(YPosC) * YPosT;

                    bubbleEl.style.transform = `translate3d(${bubbleListEl.XPos}px, ${bubbleListEl.YPos}px, 0)`;

                    requestAnimationFrame(animate);

                }

                requestAnimationFrame(animate);

            }, 250 * i);
        }
    }

    // Set each bubble position related to mouse
    setPointerPositionBubble(bubbleObj) {
        if (this.pointerPos.isMoved === true) {
            if (this.pointerPos.clientX > this.container.offsetWidth - this.bubblesGlassObj.width / 2) {
                bubbleObj.XPos = this.container.offsetWidth - this.bubblesGlassObj.width / 2 - this.bubbleElObj.width / 2;
            } else if (this.pointerPos.clientX < this.bubblesGlassObj.width / 2) {
                bubbleObj.XPos = this.bubblesGlassObj.width / 2 - this.bubbleElObj.width / 2;
            } else {
                bubbleObj.XPos = this.pointerPos.clientX - this.bubbleElObj.width / 2;
            }

            if (this.pointerPos.clientY < 200) {
                bubbleObj.YPos = 200 - this.bubbleElObj.height;
            } else if (this.pointerPos.clientY > this.container.offsetHeight - this.bubblesGlassObj.height) {
                bubbleObj.YPos = this.container.offsetHeight - this.bubblesGlassObj.height - this.bubbleElObj.height;
            } else {
                bubbleObj.YPos = this.pointerPos.clientY - this.bubbleElObj.height;
            }
        }
    }

    // Reset each bubble position related to mouse and top position
    resetPointerPositionBubble(bubbleObj) {
        if (bubbleObj.YPos < -this.bubbleElObj.height) {
            if (this.pointerPos.isMoved === true) {
                if (this.pointerPos.clientX > this.container.offsetWidth - this.bubblesGlassObj.width / 2) {
                    bubbleObj.XPos = this.container.offsetWidth - this.bubblesGlassObj.width / 2 - this.bubbleElObj.width / 2;
                } else if (this.pointerPos.clientX < this.bubblesGlassObj.width / 2) {
                    bubbleObj.XPos = this.bubblesGlassObj.width / 2 - this.bubbleElObj.width / 2;
                } else {
                    bubbleObj.XPos = this.pointerPos.clientX - this.bubbleElObj.width / 2;
                }
    
                if (this.pointerPos.clientY < 200) {
                    bubbleObj.YPos = 200 - this.bubbleElObj.height;
                } else if (this.pointerPos.clientY > this.container.offsetHeight - this.bubblesGlassObj.height) {
                    bubbleObj.YPos = this.container.offsetHeight - this.bubblesGlassObj.height - this.bubbleElObj.height;
                } else {
                    bubbleObj.YPos = this.pointerPos.clientY - this.bubbleElObj.height;
                }
            } else {
                bubbleObj.XPos = this.container.offsetWidth / 2 - this.bubbleElObj.width / 2;
                bubbleObj.YPos = this.container.offsetHeight - this.bubblesGlassObj.height - this.bubbleElObj.height;
            }
        }
    }

    // Set bubbles glass position related to mouse
    setPointerPositionBubblesGlass(bubblesGlassObj) {
        bubblesGlassObj.XPos = this.container.offsetWidth / 2 - this.bubblesGlassObj.width / 2;
        bubblesGlassObj.YPos = this.container.offsetHeight - this.bubblesGlassObj.height;

        if (this.pointerPos.isMoved === true) {
            if (this.pointerPos.clientX > this.container.offsetWidth - this.bubblesGlassObj.width / 2) {
                bubblesGlassObj.XPos = this.container.offsetWidth - this.bubblesGlassObj.width;
            } else if (this.pointerPos.clientX < this.bubblesGlassObj.width / 2) {
                bubblesGlassObj.XPos = 0;
            } else {
                bubblesGlassObj.XPos = this.pointerPos.clientX - this.bubblesGlassObj.width / 2;
            }

            if (this.pointerPos.clientY < 200) {
                bubblesGlassObj.YPos = 200;
            } else if (this.pointerPos.clientY > this.container.offsetHeight - this.bubblesGlassObj.height) {
                bubblesGlassObj.YPos = this.container.offsetHeight - this.bubblesGlassObj.height;
            } else {
                bubblesGlassObj.YPos = this.pointerPos.clientY;
            }
        }
    }

    getPointerPos() {
        this.container.addEventListener('mousemove', e => {
            this.pointerPos.clientX = e.clientX;
            this.pointerPos.clientY = e.clientY;
            this.pointerPos.isMoved = true;
        });
    }

    // Generate
    generate() {
        this.constructHtml();
        this.getPointerPos();
        this.initBackground();
        this.initBubblesGlass();
        this.initBubbles();
    };
}

OTO.Bubble = class {
    constructor(x, y) {
        this.XPos = x;
        this.YPos = y;
    }

    set newXPosition(x) {
        this.XPos = x;
    }

    set newYPosition(y) {
        this.YPos = y;
    }

    initBubble() {
        return this;
    }
}