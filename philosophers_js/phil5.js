// Teoria Współbieżnośi, implementacja problemu 5 filozofów w node.js
// Opis problemu: http://en.wikipedia.org/wiki/Dining_philosophers_problem
//   https://pl.wikipedia.org/wiki/Problem_ucztuj%C4%85cych_filozof%C3%B3w
// 1. Dokończ implementację funkcji podnoszenia widelca (Fork.acquire).
// 2. Zaimplementuj "naiwny" algorytm (każdy filozof podnosi najpierw lewy, potem
//    prawy widelec, itd.).
// 3. Zaimplementuj rozwiązanie asymetryczne: filozofowie z nieparzystym numerem
//    najpierw podnoszą widelec lewy, z parzystym -- prawy. 
// 4. Zaimplementuj rozwiązanie z kelnerem (według polskiej wersji strony)
// 5. Zaimplementuj rozwiążanie z jednoczesnym podnoszeniem widelców:
//    filozof albo podnosi jednocześnie oba widelce, albo żadnego.
// 6. Uruchom eksperymenty dla różnej liczby filozofów i dla każdego wariantu
//    implementacji zmierz średni czas oczekiwania każdego filozofa na dostęp 
//    do widelców. Wyniki przedstaw na wykresach.



function random(range) {
    return Math.floor(Math.random() * range);
}
  
var Fork = function() {
    this.state = 0;
    return this;
}

Fork.prototype.acquire = function(cb) { 
    // zaimplementuj funkcję acquire, tak by korzystala z algorytmu BEB
    // (http://pl.wikipedia.org/wiki/Binary_Exponential_Backoff), tzn:
    // 1. przed pierwszą próbą podniesienia widelca Filozof odczekuje 1ms
    // 2. gdy próba jest nieudana, zwiększa czas oczekiwania dwukrotnie
    //    i ponawia próbę, itd.

    var fork = this,
    waiting = function(ms) {
        setTimeout(()=> {
            if (fork.state == 0) {
                fork.state = 1;
                cb();
            }
            else{
                //waiting(random(2*ms));
                waiting(2*ms);
             };
        }, ms)	
	};

    waiting(1);
}

Fork.prototype.release = function() { 
    this.state = 0; 
}

var Philosopher = function(id, forks) {
    this.id = id;
    this.forks = forks;
    this.f1 = id % forks.length;
    this.f2 = (id+1) % forks.length;
    return this;
}


Philosopher.prototype.startNaive = function(count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    
    // zaimplementuj rozwiązanie naiwne
    // każdy filozof powinien 'count' razy wykonywać cykl
    // podnoszenia widelców -- jedzenia -- zwalniania widelców
    this.waitingTime = 0;
    var myself = this;

    var loop = function(count){
        if(count > 0){
            setTimeout(() => {
                myself.startTime = performance.now();
                forks[f1].acquire(() => {
                    forks[f2].acquire(() => {
                        myself.stopTime = performance.now();
                        myself.waitingTime += (myself.stopTime - myself.startTime);

                        //console.log("Philosopher " + id + " is eating... ");
                        setTimeout(() => {
                            forks[f2].release();
                            forks[f1].release();
                            loop(count - 1)
                        }, random(100));

                    });
                });   
            }, random(100));
        }else{
            console.log("Philosopher " + id + " completed. Waiting time is ", myself.waitingTime);
            totalTime += myself.waitingTime;
        };
    };

    loop(count);
}

Philosopher.prototype.startAsym = function(count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    // zaimplementuj rozwiązanie asymetryczne
    // każdy filozof powinien 'count' razy wykonywać cykl
    // podnoszenia widelców -- jedzenia -- zwalniania widelców

    this.waitingTime = 0;
    var myself = this;

    var loopOdd = function(count){
        if(count > 0){
            setTimeout(() => {
                myself.startTime = performance.now();
                forks[f1].acquire(() => {
                    forks[f2].acquire(() => {
                        myself.stopTime = performance.now();
                        myself.waitingTime += (myself.stopTime - myself.startTime);

                        //console.log("Philosopher " + id + " is eating... ");
                        setTimeout(() => {
                            forks[f2].release();
                            forks[f1].release();
                            loopOdd(count - 1)
                        }, random(100));

                    });
                });   
            }, random(100));
        }else{
            console.log("Philosopher " + id + " completed. Waiting time is ", myself.waitingTime);
            totalTime += myself.waitingTime;
        };
    };

    var loopEven = function(count){
        if(count > 0){
            setTimeout(() => {
                myself.startTime = performance.now();
                forks[f2].acquire(() => {
                    forks[f1].acquire(() => {
                        myself.stopTime = performance.now();
                        myself.waitingTime += (myself.stopTime - myself.startTime);

                        //console.log("Philosopher " + id + " is eating... ");
                        setTimeout(() => {
                            forks[f1].release();
                            forks[f2].release();
                            loopEven(count - 1)
                        }, random(100));

                    });
                });   
            }, random(100));
        }else{
            console.log("Philosopher " + id + " completed. Waiting time is ", myself.waitingTime);
            totalTime += myself.waitingTime;
        };
    };

    if(id%2 == 0){
        loopEven(count);
    }else{
        loopOdd(count);
    }

}


var Conductor = function(philosophers_num) {
    this.state = 0;
    this.max_val = philosophers_num-1;
    return this;
}


Conductor.prototype.acquire = function(cb) { 
    var conductor = this;

    var waiting = function(ms) {
        setTimeout(()=> {
            if (conductor.state < conductor.max_val) {
                conductor.state += 1;
                cb();
            }
            else{
                //waiting(random(2*ms));
                waiting(2*ms);
             };
        }, ms)	
	};

    waiting(1);
}


Conductor.prototype.release = function() { 
    this.state-=1; 
}



Philosopher.prototype.startConductor = function(count, conductor) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    
    // zaimplementuj rozwiązanie z kelnerem
    // każdy filozof powinien 'count' razy wykonywać cykl
    // podnoszenia widelców -- jedzenia -- zwalniania widelców

    this.waitingTime = 0;
    var myself = this;


    var loopConductor = function(count){
        if(count > 0){
            setTimeout(() => {
                myself.startTime = performance.now();
                conductor.acquire(() =>
                    forks[f1].acquire(() => {
                        forks[f2].acquire(() => {
                            myself.stopTime = performance.now();
                            myself.waitingTime += (myself.stopTime - myself.startTime);

                            //console.log("Philosopher " + id + " is eating... ");
                            setTimeout(() => {
                                conductor.release();
                                forks[f2].release();
                                forks[f1].release();
                                loopConductor(count - 1)
                            }, random(100));

                        })
                    })
                );
            }, random(100));
        }else{
            console.log("Philosopher " + id + " completed. Waiting time is ", myself.waitingTime);
            totalTime += myself.waitingTime;
        };
    };

    loopConductor(count);


}


const acquireParallel = function(forks, f1, f2, cb) { 
    var waiting = function(ms) {
        setTimeout(()=> {
            if (forks[f1].state == 0 & forks[f2].state == 0 ) {
                forks[f1].state = 1;
                forks[f2].state = 1;
                cb();
            }
            else{
                //waiting(random(2*ms));
                waiting(2*ms);
             };
        }, ms)	
	};

    waiting(1);
}

const releaseParalell = function(forks, f1, f2) { 
    forks[f1].state = 0;
    forks[f2].state = 0;
}


Philosopher.prototype.startParallel = function(count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    
    // TODO: wersja z jednoczesnym podnoszeniem widelców
    // Algorytm BEB powinien obejmować podnoszenie obu widelców, 
    // a nie każdego z osobna

    this.waitingTime = 0;
    var myself = this;

    var loopParallel = function(count){
        if(count > 0){
            setTimeout(() => {
                myself.startTime = performance.now();
                acquireParallel(forks, f1, f2, () =>{
                        myself.stopTime = performance.now();
                        myself.waitingTime += (myself.stopTime - myself.startTime);

                        //console.log("Philosopher " + id + " is eating... ");
                        setTimeout(() => {
                            releaseParalell(forks, f1, f2);
                            loopParallel(count - 1)
                        }, random(100));
                
                    });
                   
            }, random(100));
        }else{
            console.log("Philosopher " + id + " completed. Waiting time is ", myself.waitingTime);
            totalTime += myself.waitingTime;
        };
    };

    loopParallel(count);


}



const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


var totalTime;

rl.question('Philosophers number: ', (philosophers_num) => {
    N = parseInt(philosophers_num);
    rl.question('Meals number: ', (meals_num) => {
	meals = parseInt(meals_num);
	rl.close();
    var forks = [];
    var philosophers = [];
    var conductor = new Conductor(N);

    for (var i = 0; i < N; i++) {
        forks.push(new Fork());
    }
    
    for (var i = 0; i < N; i++) {
        philosophers.push(new Philosopher(i, forks));
    }
    
    
    totalTime = 0;
    console.log("Asymetric solution");
    for (var i = 0; i < N; i++) {
        philosophers[i].startAsym(meals);
    }

    setTimeout(() => {
        console.log("   -----------------------------   ");
        console.log("Asymetric solution completed.");
        console.log("Average waiting time : " + totalTime/(meals*N));
        console.log("   -----------------------------   ");

        totalTime = 0;
        console.log("Solution with parallel forks taking");
        for (var i = 0; i < N; i++) {
            philosophers[i].startParallel(meals);
        }
    }, meals*N*200)


    setTimeout(() => {
        console.log("   -----------------------------   ")
        console.log("Solution with parallel forks taking completed.");
        console.log("Average waiting time : " + totalTime/(meals*N));
        console.log("   -----------------------------   ")

        totalTime = 0;
        console.log("Solution with conductor");
        for (var i = 0; i < N; i++) {
            philosophers[i].startConductor(meals, conductor);
        }
    }, meals*N*400);

    setTimeout(()=> {
        console.log("   -----------------------------   ")
        console.log("Solution with conductor completed.");
        console.log("Average waiting time : " + totalTime/(meals*N));
        console.log("   -----------------------------   ")
    }, meals*N*1000)

});
});


/*
var N = 5;
var meals = 30;
var forks = [];
var philosophers = [];
var conductor = new Conductor(N);

for (var i = 0; i < N; i++) {
    forks.push(new Fork());
}

for (var i = 0; i < N; i++) {
    philosophers.push(new Philosopher(i, forks));
}

totalTime = 0;
for (var i = 0; i < N; i++) {
    philosophers[i].startConductor(meals,conductor);
}

*/