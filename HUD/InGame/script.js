var hud = function () {
    this.direction = 45;
    this.damage = 50;
    this.maxHealth = 250;
    this.previousHealth = this.currentHealth = this.maxHealth;

    this.updateBars = function () {
        var deadbars = Math.floor(5 * (this.maxHealth - this.currentHealth) / this.maxHealth);
        document.querySelector(".health-unit:nth-last-child(" + deadbars + ")").className = "health-unit red";

    };

    this.updateMaxHealth = function (qty) {
        document.querySelector("#max-health").innerHTML = "/" + qty;
    };

    this.updateHealth = function (qty) {
        if (qty > 0) {
            this.currentHealth = qty;
        } else {
            this.currentHealth = 0;
        }
        document.querySelector("#current-health").innerHTML = this.currentHealth;
        //this.updateBars();
    };

    this.resetHealth = function () {
        this.updateHealth(Math.round(this.maxHealth));
        this.updateMaxHealth(Math.round(this.maxHealth));
    };

    this.takeDamage = function () {
        this.updateHealth(Math.floor(this.currentHealth - this.damage));

        document.documentElement.style.setProperty(
            "--blinktime",
            this.damage / 100 + 0.2 + "s"
        ); //set how long damage indicator displays
        document
            .querySelector("#damage")
            .style.setProperty("--stroke-width", this.damage / 10 + 5 + "px"); //set how thick the damage indicator is
        document.querySelector("#damage").style.transform =
            "rotate(" + this.direction + "deg) translate(-50%,-50%)"; //set indicator's rotation
        document.querySelector("#damage").className = "damage-opacity"; //reset classes

        //now do some hack to replay the animation
        window.requestAnimationFrame(function (time) {
            window.requestAnimationFrame(function (time) {
                document.querySelector(".damage-opacity").className =
                    "damage-opacity blink";
            });
        });
    };

    this.hit = function () {
        document.querySelector("#hit_indicator").className = "hit";
        document.documentElement.style.setProperty("--blinktime", "0.3s");
        window.requestAnimationFrame(function (time) {
            window.requestAnimationFrame(function (time) {
                document.querySelector(".hit").className = "hit blink";
            });
        });
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
