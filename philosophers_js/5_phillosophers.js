//Five Philosophers problem solution
//created during classes at AGH UST

function random(range) {
    return Math.floor(Math.random() * range);
}
  
var Fork = function() {
    this.state = 0;
    return this;
}

Fork.prototype.acquire = function(cb) { 
    //waiting function use simply Exponential Backoff algorithm

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


//naive solution
Philosopher.prototype.startNaive = function(count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;
    
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


//asymetric solution
Philosopher.prototype.startAsym = function(count) {
    var forks = this.forks,
        f1 = this.f1,
        f2 = this.f2,
        id = this.id;

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


// solution with conductor

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


// solution with parallel forks taking

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


// coide to test it

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

