var domCache = [];

const dom = (selector) => domCache[selector] || (domCache[selector] = document.querySelector(selector));

var hud = function () {
    this.direction = 45;
    this.damage = 50;
    this.maxHealth = 250;
    this.currentHealth = this.maxHealth;
    this.navDirection = 0;

    this.updateDirection = (value) => {
        xValue = 400 + Math.floor(-value / 360 * 4000);

        const compassElements = dom(".compass-tape");
        compassElements.style.backgroundPositionX = `${xValue}px`;
    };

    this.updateBars = (() => {
        const healthUnitElements = document.querySelectorAll(".health-unit");
        return () => {
            var deadBars = Math.floor(5 * (this.maxHealth - this.currentHealth) / this.maxHealth);
            for (let i = healthUnitElements.length; --i >= 0;) {
                if (deadBars < (5 - i)) {
                    healthUnitElements[i].classList.remove('red');
                } else {
                    healthUnitElements[i].classList.add('red');
                }
            }
        };
    })();

    this.updateMaxHealth = (qty) => {
        dom(".max-health").innerHTML = "/" + qty;
    };

    this.updateHealth = (qty) => {
        this.currentHealth = Math.max(0, qty);
        dom(".current-health").innerHTML = this.currentHealth;

        this.updateBars();
    };

    this.resetHealth = () => {
        this.updateHealth(Math.round(this.maxHealth));
        this.updateMaxHealth(Math.round(this.maxHealth));
    };

    this.updateHumanBody = (() => {
        const elements = {
            head: document.querySelector('.human-body .head'),
            shoulder: document.querySelector('.human-body .shoulder'),
            arm: document.querySelector('.human-body .arm'),
            hands: document.querySelector('.human-body .hands'),
            chest: document.querySelector('.human-body .chest'),
            stomach: document.querySelector('.human-body .stomach'),
            legs: document.querySelector('.human-body .legs'),
        }

        return (type, state) => {
            elements[type].style.fill = state;
        };
    })();

    this.damageHead = () => {
        this.updateHumanBody('head', 'red');
    }

    this.damageShoulder = () => {
        this.updateHumanBody('shoulder', 'red');
    }

    this.damageArm = () => {
        this.updateHumanBody('arm', 'red');
    }

    this.damageHands = () => {
        this.updateHumanBody('hands', 'red');
    }

    this.damageChest = () => {
        this.updateHumanBody('chest', 'red');
    }

    this.damageStomach = () => {
        this.updateHumanBody('stomach', 'red');
    }

    this.damageLegs = () => {
        this.updateHumanBody('legs', 'red');
    }

    this.takeDamage = () => {
        const damageElement = dom(".damage");
        this.updateHealth(Math.floor(this.currentHealth - this.damage));

        document.documentElement.style.setProperty("--blinktime", this.damage / 100 + 0.2 + "s"); //set how long damage indicator displays

        damageElement.style.setProperty("--stroke-width", this.damage / 10 + 5 + "px"); //set how thick the damage indicator is
        damageElement.style.transform = "rotate(" + this.direction + "deg) translate(-50%,-50%)"; //set indicator's rotation
        damageElement.classList.remove("blink");

        //now do some hack to replay the animation
        setTimeout(function (time) {
            damageElement.classList.add('blink');
        }, 1);
    };

    this.hit = () => {
        const indicatorElement = dom(".hit_indicator");
        indicatorElement.classList.remove('hitBlink');
        setTimeout(function (time) {
            indicatorElement.classList.add('hitBlink');
        }, 1);
    };
};

window.onload = function () {
    var fpshud = new hud();
    var gui = new dat.GUI();
    var maxHealthController = gui.add(fpshud, "maxHealth", 10, 800);
    gui.add(fpshud, "resetHealth");
    gui.add(fpshud, "hit");
    var directionController = gui.add(fpshud, "direction", 0, 360);
    var damageController = gui.add(fpshud, "damage", 10, 100);
    gui.add(fpshud, "takeDamage");
    gui.add(fpshud, 'damageHead');
    gui.add(fpshud, 'damageShoulder');
    gui.add(fpshud, 'damageArm');
    gui.add(fpshud, 'damageHands');
    gui.add(fpshud, 'damageChest');
    gui.add(fpshud, 'damageStomach');
    gui.add(fpshud, 'damageLegs');

    var navDirectionController = gui.add(fpshud, "navDirection", -180, 420);
    navDirectionController.onChange(function (value) {
        fpshud.updateDirection(value);
    });
    maxHealthController.onFinishChange(function (value) {
        fpshud.resetHealth();
    });
    directionController.onFinishChange(function (value) {
        fpshud.takeDamage();
    });
    damageController.onFinishChange(function (value) {
        fpshud.takeDamage();
    });
};
