package version1;


import java.util.concurrent.Semaphore;


public class Table1 {
    public static void main(int phil_num, int meals_num) throws InterruptedException {
        Semaphore[] chopsticks = new Semaphore[phil_num];
        PhilosopherParallel[] philosophers = new PhilosopherParallel[phil_num];
        double totalWaitingTime = 0;

        for(int i = 0; i < phil_num; i++){
            chopsticks[i] = new Semaphore(1);
        }

        for(int i = 0; i < phil_num; i++){
            philosophers[i] = new PhilosopherParallel(chopsticks[i% phil_num], chopsticks[(i+1)% phil_num], i, meals_num);
        }

        for(PhilosopherParallel philosopher: philosophers){
            philosopher.start();
        }

        for(PhilosopherParallel philosopher: philosophers){
            philosopher.join();
            totalWaitingTime += philosopher.getWaitingTime();
        }

        System.out.println(" ");
        System.out.println("     --- SUMMARY ---     ");
        System.out.println("    PARALLEL SOLUTION     ");
        System.out.println("Average waiting time : " + totalWaitingTime/(phil_num*meals_num));
        System.out.println("     ---------------   ");



        for(PhilosopherParallel philosopher: philosophers){
            philosopher.showStats();
        }





    }
}
