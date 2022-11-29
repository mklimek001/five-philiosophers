package version3;

import java.util.Random;
import java.util.concurrent.Semaphore;

import static java.lang.System.currentTimeMillis;


public class PhilosopherWithConductor extends Thread{
    Semaphore left_chopstick;
    Semaphore right_chopstick;
    Semaphore arbitrator;
    int id_number;
    int eaten = 0;
    int iterations;

    long waiting_time = 0;

    Random rand = new Random();

    public PhilosopherWithConductor(Semaphore l_chopstick,Semaphore r_chopstick, Semaphore arbitrator, int id, int count){
        left_chopstick = l_chopstick;
        right_chopstick= r_chopstick;
        id_number = id;
        iterations = count;
        this.arbitrator = arbitrator;
    }

    private void eating() throws InterruptedException {
        System.out.println("Philosopher " + id_number + " is eating...");
        sleep(rand.nextInt(100));
        eaten+=1;
    }

    public void showStats(){
        System.out.println("Philosopher  : " + id_number);
        System.out.println("Eaten        : " + eaten);
        System.out.println("Waiting time : " + waiting_time);
        System.out.println("Average time : " + (double)waiting_time/eaten);
        System.out.println("     ---------------   ");
    }

    public double getWaitingTime(){
        return waiting_time;
    }

    public void run() {
        while(eaten < iterations) {
            try {
                sleep(rand.nextInt(100));
                long start = currentTimeMillis();
                arbitrator.acquire();
                left_chopstick.acquire();
                right_chopstick.acquire();
                long stop = currentTimeMillis();
                eating();
                right_chopstick.release();
                left_chopstick.release();
                arbitrator.release();
                waiting_time += (stop - start);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }

}
