class Obj {
    constructor(x, y, w, h, a) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.a = a;
    }

    draw() {
        let img = new Image();
        img.src = this.a;
        des.drawImage(img, this.x, this.y, this.w, this.h);
    }
}

class Carro extends Obj {
    dir = 0;
    vida = 5;

    move() {
        this.x += this.dir;
        const canvas = document.getElementById('des');
        if (this.x < 0) this.x = 0;
        if (this.x + this.w > canvas.clientWidth) this.x = canvas.clientWidth - this.w;
    }

    colid(objeto) {
        return !(
            this.x > objeto.x + objeto.w ||
            this.x + this.w < objeto.x ||
            this.y > objeto.y + objeto.h ||
            this.y + this.h < objeto.y
        );
    }
}

class Carro2 extends Obj {
    speed = 2;
    ultrapassado = false;

    move() {
        const canvas = document.getElementById('des');
        if (this.y >= 910) {
            this.y = -110;
            this.x = Math.random() * (canvas.clientWidth - this.w);
            this.ultrapassado = false;
        }
        this.y += this.speed;
    }
}

class Est extends Obj {
    des_quad() {
        des.beginPath();
        des.strokeStyle = this.a;
        des.lineWidth = 5;
        des.fillStyle = "white";
        des.rect(this.x, this.y, this.w, this.h);
        des.closePath();
        des.stroke();
        des.fill();
    }

    move() {
        this.y += 4;
        if (this.y >= 850) {
            this.y = -50;
        }
    }
}