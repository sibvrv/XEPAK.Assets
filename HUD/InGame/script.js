var hud = function () {
    this.direction = 45;
    this.damage = 50;
    this.maxHealth = 250;
    this.currentHealth = this.maxHealth;

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
        document.querySelector(".max-health").innerHTML = "/" + qty;
    };

    this.updateHealth = (qty) => {
        if (qty > 0) {
            this.currentHealth = qty;
        } else {
            this.currentHealth = 0;
        }
        document.querySelector(".current-health").innerHTML = this.currentHealth;

        // const progress = this.currentHealth / this.maxHealth;

        this.updateBars();
    };

    this.resetHealth = () => {
        this.updateHealth(Math.round(this.maxHealth));
        this.updateMaxHealth(Math.round(this.maxHealth));
    };

    this.takeDamage = (() => {
        const damageElement = document.querySelector(".damage");
        return () => {
            this.updateHealth(Math.floor(this.currentHealth - this.damage));

            document.documentElement.style.setProperty("--blinktime", this.damage / 100 + 0.2 + "s"); //set how long damage indicator displays

            damageElement.style.setProperty("--stroke-width", this.damage / 10 + 5 + "px"); //set how thick the damage indicator is
            damageElement.style.transform = "rotate(" + this.direction + "deg) translate(-50%,-50%)"; //set indicator's rotation
            damageElement.classList.remove("blink");

            //now do some hack to replay the animation
            setTimeout(function (time) {
                damageElement.classList.add('blink');
            }, 1);
        }
    })();

    this.hit = (() => {
        const indicatorElement = document.querySelector(".hit_indicator");
        return () => {
            indicatorElement.classList.remove('hitBlink');
            setTimeout(function (time) {
                indicatorElement.classList.add('hitBlink');
            }, 1);
        }
    })();
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
