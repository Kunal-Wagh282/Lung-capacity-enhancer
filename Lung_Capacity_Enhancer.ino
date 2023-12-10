#include <LiquidCrystal.h>
#include <SoftwareSerial.h>
SoftwareSerial bluetooth(10, 11); // RX, TX pins for HC-05 module 
  LiquidCrystal lcd(8, 7, 6, 5, 4, 3); 
  float i = 0.0;
  unsigned long startTime=0;
  const unsigned long interval = 7000;
  String data;
  float l1=1.25,l2=2.5,l3=3.75,l4=5.0,l5=6.25,s;      
  int age=12,t=6.25;
  static String receivedValueString = "";
  int receivedValue = 0;

  void br()
  {
    if(age==0)
    { lcd.clear();
          lcd.setCursor(2, 0);
          lcd.print("INVALID AGE..");
          lcd.setCursor(0, 1);
          lcd.print("ENTER VALID AGE");
          }
    else{
      i++;  
      Serial.println(i); 
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Your_time:");
      s=i/35;
      lcd.print(s); lcd.print(" Sec");
      lcd.setCursor(0, 1);
      float score=(100*s)/t;
      if(score<100){
      lcd.print("Score:");lcd.print(score);lcd.print("%");}
      else{
        lcd.print("Score:");lcd.print("100%");}
      if (s < l2 && s >=l1) {
          digitalWrite(14, HIGH);
          digitalWrite(15, LOW);
          digitalWrite(16, LOW);
          digitalWrite(17, LOW);
          digitalWrite(18, LOW);
      }
      if (s < l3 && s >= l2) {
          digitalWrite(14, HIGH);
          digitalWrite(15, HIGH);
          digitalWrite(16, LOW);
          digitalWrite(17, LOW);
          digitalWrite(18, LOW);
      }
      if (s < l4 && s >= l3) {
          digitalWrite(14, HIGH);
          digitalWrite(15, HIGH);
          digitalWrite(16, HIGH);
          digitalWrite(17, LOW);
          digitalWrite(18, LOW);
      }
      if (s < l5 && s >= l4) {
          digitalWrite(14, HIGH);
          digitalWrite(15, HIGH);
          digitalWrite(16, HIGH);
          digitalWrite(17, HIGH);
          digitalWrite(18, LOW);
      }
      if (s >= l5) {
          digitalWrite(14, HIGH);
          digitalWrite(15, HIGH);
          digitalWrite(16, HIGH);
          digitalWrite(17, HIGH);
          digitalWrite(18, HIGH);
      }
      if(i>=3 && i<=10)
    {
      startTime = millis();
    }
    bluetooth.print("Time:");
    bluetooth.println(s);
    } 
  }
  void setup() {
      Serial.begin(9600); // Initialize serial communication
      bluetooth.begin(9600);
      lcd.begin(16, 2);
      analogWrite(9, 0);
      lcd.setCursor(0, 0);
      lcd.print("   !!Welcome!!");
      lcd.setCursor(0, 1);
      lcd.print("    ENTER AGE");
      pinMode(2, INPUT_PULLUP);
      pinMode(14, OUTPUT);
      pinMode(15, OUTPUT);
      pinMode(16, OUTPUT);
      pinMode(17, OUTPUT);
      pinMode(18, OUTPUT);
      attachInterrupt(digitalPinToInterrupt(2), br, RISING);
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
    digitalWrite(14, LOW);
    digitalWrite(15, LOW);
    digitalWrite(16, LOW);
    digitalWrite(17, LOW);
    digitalWrite(18, LOW);
    digitalWrite(19, LOW);
    i = 0;
    s=0;
    startTime = 0;
  }
  
  void loop() {
    while (bluetooth.available() > 0) {
    char receivedChar = bluetooth.read();
    if (isdigit(receivedChar)) {
      receivedValueString += receivedChar;  
    } else {   
      if (receivedValueString.length() > 0) {  
        age = receivedValueString.toInt();   
        Serial.print("Received Value: ");
        Serial.println(age);
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
             if(age<=8 && age>5){//1 LITRES
              l1=0.875;
              l2=1.50;
              l3=3.125;
              l4=3.75;
              l5=4.5;
              t=4.5; 
            }  
            if(age<=12 && age>8){//1 LITRES
              l1=1.875;
              l2=2.50;
              l3=3.125;
              l4=5.75;
              l5=6.5;
              t=6.5; 
            } 
            if((age<=16 && age>12)|| (age>40)){//2 LITRES
              l1=3.25;
              l2=4.5;
              l3=5.75;
              l4=7.0;
              l5=8.25;
              t=8.25;
            }
            if(age<=40 && age>25)//4 LITRES
            {
              l1=2.5;
              l2=5.0;
              l3=7.5;
              l4=10.0;
              l5=12.5;
              t=12.5;
            }
            if(age<=25 && age>16){//4.8 LITRES
                l1=3;
                l2=6;
                l3=9;
                l4=12;
                l5=15; 
                t=15;  
            }   
          }  
        receivedValueString = "";
      }
    }
  }
    if(startTime != 0 && (millis() - startTime) > interval ) 
    {  
          resetgame();     
    } 
    bluetooth.print("Time: ");
    bluetooth.println(s);
    delay(1000);       
  }
