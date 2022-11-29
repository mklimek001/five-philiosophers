package version0;


import version1.PhilosopherParallel;

import java.util.concurrent.Semaphore;
import static java.lang.Thread.sleep;

public class Table0 {
    public static void main(int phil_num, int meals_num) throws InterruptedException {
        Semaphore[] chopsticks = new Semaphore[phil_num];
        PhilosopherNaive[] philosophers = new PhilosopherNaive[phil_num];
        double totalWaitingTime = 0;

        for(int i = 0; i < phil_num; i++){
            chopsticks[i] = new Semaphore(1);
        }

        for(int i = 0; i < phil_num; i++){
            philosophers[i] = new PhilosopherNaive(chopsticks[i% phil_num], chopsticks[(i+1)% phil_num], i, meals_num);
        }

        for(PhilosopherNaive philosopher: philosophers){
            philosopher.start();
        }

        for(PhilosopherNaive philosopher: philosophers){
            philosopher.join();
            totalWaitingTime += philosopher.getWaitingTime();
        }

        System.out.println("     --- SUMMARY ---     ");
        System.out.println("      NAIVE SOLUTION     ");
        System.out.println("Average waiting time : " + totalWaitingTime/(phil_num*meals_num));
        System.out.println("     ---------------   ");

        for(PhilosopherNaive philosopher: philosophers){
            philosopher.showStats();
        }

    }
}
