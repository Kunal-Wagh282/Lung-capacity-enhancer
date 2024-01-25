#include <LiquidCrystal.h>
#include <SoftwareSerial.h>
#include "melody_function.h"
#include "levels_function.h"
// Define pin for the buzzer
#define BUZZER_PIN 12
#define RED1 14
#define RED2 15
#define YELLOW1 16
#define YELLOW2 17
#define GREEN 18


// SoftwareSerial for Bluetooth communication
SoftwareSerial bluetooth(10, 11); // RX, TX pins for HC-05 module 
LiquidCrystal lcd(8, 7, 6, 5, 4, 3); // LiquidCrystal for LCD display
// Variables for game logic
float i = 0.0;
float j = 0.0;

unsigned long startTime=0;
const unsigned long interval = 7000;// Time interval for the game
const unsigned long interval2 = 1500;// Time interval for the game over sound
String data;
float l1=1.25,l2=2.5,l3=3.75,l4=5.0,l5=6.25,s;      
int age=12,t=6.25;// Initial age and threshold time
static String receivedValueString = "";
int receivedValue = 0;
float l_hour;
// Function to handle blowing interruption (attached to interrupt pin)
  void br()
  {
    if(age==0)// Check if the age is valid
    { lcd.clear();
          lcd.setCursor(2, 0);
          lcd.print("INVALID AGE..");
          lcd.setCursor(0, 1);
          lcd.print("ENTER VALID AGE");
          }
    else{
      i++;
      j++;  
      //Serial.println(i); 
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Your_time:");
      s=i/37;// Calculate time based on blowing count
      lcd.print(s); lcd.print(" Sec");
      lcd.setCursor(0, 1);
      float score=(100*s)/t;// Calculate score
      if(score<100){
      lcd.print("Score:");lcd.print(score);lcd.print("%");}
      else{
        lcd.print("Score:");lcd.print("100%");}
          // Illuminate LEDs based on time thresholds
      if (s < l2 && s >=l1) {
          level_1(RED1,RED2,YELLOW1,YELLOW2,GREEN);
         
      }
      else if (s < l3 && s >= l2) {
          level_2(RED1,RED2,YELLOW1,YELLOW2,GREEN) ;  
      }
      else if (s < l4 && s >= l3) {
          level_3(RED1,RED2,YELLOW1,YELLOW2,GREEN);
      }
      else if (s < l5 && s >= l4) {
          level_4(RED1,RED2,YELLOW1,YELLOW2,GREEN);
      }
      else if (s >= l5) {
          level_5(RED1,RED2,YELLOW1,YELLOW2,GREEN);
      }
      if(i>=3 && i<=10)// Start the timer for the game
    {
      startTime = millis();
    }
//    l_hour = (j * 1 / 7.5);
//    j=0.0;
    String data=String(s)+","+String(l_hour);
    bluetooth.println(data);
   
    } 
  }
  void setup() {
      Serial.begin(9600); // Initialize serial communication
      pinMode(BUZZER_PIN, OUTPUT);
      bluetooth.begin(9600);
      lcd.begin(16, 2);
      analogWrite(9, 0);
      lcd.setCursor(0, 0);
      lcd.print("   !!Welcome!!");
      lcd.setCursor(0, 1);
      lcd.print("    ENTER AGE");
      start(BUZZER_PIN  );// Play the starting melody
      pinMode(2, INPUT_PULLUP);// Set the blowing interrupt pin as an input with a pull-up resistor
      pinMode(14, OUTPUT);
      pinMode(15, OUTPUT);
      pinMode(16, OUTPUT);
      pinMode(17, OUTPUT);
      pinMode(18, OUTPUT);
      attachInterrupt(digitalPinToInterrupt(2), br, RISING); // Attach the interrupt handler
  }

  void resetgame()
  {
    analogWrite(9, 0);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.setCursor(5, 0);
    lcd.print("AGE=");
    lcd.print(age);
    lcd.setCursor(0, 1);
    lcd.print("   NEXT TURN..!!       ");
    all_off(RED1,RED2,YELLOW1,YELLOW2,GREEN);
    i = 0;
    s=0;
    startTime = 0;
    l_hour=0; 
  }
  
  void loop() {
     // Check for incoming Bluetooth data
    while (bluetooth.available() > 0) {
    char receivedChar = bluetooth.read();
    if (isdigit(receivedChar)) {
      receivedValueString += receivedChar;  
    } else {   // Process received value when a non-digit character is received
      if (receivedValueString.length() > 0) {  
        age = receivedValueString.toInt(); // Convert received value to age  
        Serial.print("Received Value: ");
        Serial.println(age);
        // Validate age
        if(age<=5){
          lcd.clear();
          lcd.setCursor(2, 0);
          lcd.print("INVALID AGE..");
          lcd.setCursor(0, 1);
          lcd.print("ENTER VALID AGE");
          }
        else{
            lcd.clear();
            lcd.setCursor(5, 0);
            lcd.print("AGE=");
            lcd.print(age);
            lcd.setCursor(0,1);
            lcd.print(" START BLOWING");
              // Set time thresholds based on age
             if(age<=8 && age>5){//1 LITRES
              l1=0.875;l2=1.50;l3=3.125;l4=3.75;l5=4.5;t=4.5; 
            }  
            if(age<=12 && age>8){//1 LITRES
              l1=1.875;l2=2.50;l3=3.125;l4=5.75;l5=6.5;t=6.5; 
            } 
            if((age<=16 && age>12)|| (age>40)){//2 LITRES
              l1=3.25;l2=4.5;l3=5.75;l4=7.0;l5=8.25;t=8.25;
            }
            if(age<=40 && age>25)//4 LITRES
            {
              l1=2.5;l2=5.0;l3=7.5;l4=10.0;l5=12.5;t=12.5;
            }
            if(age<=25 && age>16){//4.8 LITRES
                l1=3;l2=6;l3=9;l4=12;l5=15;t=15;  
            }   
          }  
        receivedValueString = ""; // Clear the received value string
      }
    }
  }
  // Check if it's time to play the success sound
  if(startTime != 0 && (millis() - startTime) > interval2 ) 
    {  
       tune(s,BUZZER_PIN,l1,l2,l3,l4,l5);
                     
    }
    // Check if it's time to end the game
    if(startTime != 0 && (millis() - startTime) > interval ) 
    {     
          over(BUZZER_PIN);// Play the game over melody
          resetgame(); // Reset the game state    
    } 
    // Send time information over Bluetooth
    // (Pulse frequency x 60 min) / 7.5Q = flowrate in L/hour 
    l_hour = (j * 1 / 7.5);
    
    j=0.0;    
    String data=String(s)+","+String(l_hour);
    bluetooth.println(data);
    //Serial.println(data);
    delay(1000);       // Delay for stability
  }
