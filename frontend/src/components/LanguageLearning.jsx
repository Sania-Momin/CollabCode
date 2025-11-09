import React, { useState } from 'react';
import './LanguageLearning.css';

const languageData = {
  javascript: {
    name: "JavaScript",
    icon: "🟨",
    color: "#f7df1e",
    gradient: "linear-gradient(135deg, #f7df1e 0%, #d4b810 100%)",
    tagline: "The Language of the Web",
    description: "JavaScript is a versatile, high-level programming language that powers interactive web experiences. It's essential for modern web development.",
    
    sections: [
      {
        title: "🚀 Introduction",
        content: "JavaScript is the programming language of the Web. It was created in 1995 and has become one of the most popular programming languages in the world. JavaScript runs in browsers, on servers (Node.js), mobile devices, and even IoT devices.",
        highlights: [
          "Created by Brendan Eich in just 10 days",
          "Powers 97.8% of all websites",
          "Supports multiple paradigms: OOP, functional, and imperative",
          "Constantly evolving with new features (ES6+)"
        ]
      },
      {
        title: "✨ Key Features",
        items: [
          { icon: "⚡", text: "Dynamic typing - variables can hold any type", detail: "No need to declare types explicitly" },
          { icon: "🎯", text: "First-class functions", detail: "Functions are treated as values" },
          { icon: "🔄", text: "Event-driven programming", detail: "Perfect for interactive UIs" },
          { icon: "📦", text: "Prototype-based OOP", detail: "Flexible object creation" },
          { icon: "🌐", text: "Asynchronous capabilities", detail: "Promises, async/await for non-blocking code" },
          { icon: "📚", text: "Rich ecosystem", detail: "npm has over 2 million packages" }
        ]
      },
      {
        title: "💻 Syntax Basics",
        code: `// Variables - ES6+ syntax
const PI = 3.14159;        // Constant (can't reassign)
let counter = 0;           // Block-scoped variable
var oldStyle = 'legacy';   // Function-scoped (avoid)

// Functions
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Arrow functions (ES6+)
const add = (a, b) => a + b;

// Arrays and Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

// Objects
const person = {
  name: "John",
  age: 30,
  greet() {
    console.log(\`Hi, I'm \${this.name}\`);
  }
};

// Destructuring
const { name, age } = person;
const [first, second] = numbers;

// Spread operator
const newArray = [...numbers, 6, 7];
const newPerson = { ...person, city: "NYC" };

// Async/Await
async function fetchData() {
  try {
    const response = await fetch('api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`
      },
      {
        title: "🎯 Use Cases",
        items: [
          { icon: "🌐", text: "Frontend Web Development", detail: "React, Vue.js, Angular for dynamic UIs" },
          { icon: "⚙️", text: "Backend Development", detail: "Node.js, Express.js for server-side apps" },
          { icon: "📱", text: "Mobile Apps", detail: "React Native, Ionic for cross-platform" },
          { icon: "🖥️", text: "Desktop Applications", detail: "Electron for cross-platform desktop apps" },
          { icon: "🎮", text: "Game Development", detail: "Phaser, Three.js for browser games" },
          { icon: "🤖", text: "IoT & Robotics", detail: "Johnny-Five for hardware control" }
        ]
      },
      {
        title: "📖 Learning Path",
        path: [
          { step: "1", title: "Basics", topics: ["Variables, Data Types", "Operators, Conditionals", "Loops, Functions"] },
          { step: "2", title: "Intermediate", topics: ["Arrays & Objects", "DOM Manipulation", "Events & Callbacks"] },
          { step: "3", title: "Advanced", topics: ["Async Programming", "ES6+ Features", "Design Patterns"] },
          { step: "4", title: "Frameworks", topics: ["React/Vue/Angular", "Node.js & Express", "Testing & Build Tools"] }
        ]
      },
      {
        title: "🔗 Resources",
        resources: [
          { 
            name: "MDN Web Docs", 
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", 
            type: "Documentation",
            description: "Comprehensive JavaScript documentation"
          },
          { 
            name: "JavaScript.info", 
            url: "https://javascript.info", 
            type: "Tutorial",
            description: "Modern JavaScript tutorial"
          },
          { 
            name: "freeCodeCamp", 
            url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", 
            type: "Interactive",
            description: "Free interactive coding challenges"
          },
          { 
            name: "Eloquent JavaScript", 
            url: "https://eloquentjavascript.net", 
            type: "Book",
            description: "Free online book with exercises"
          }
        ]
      }
    ]
  },

  python: {
    name: "Python",
    icon: "🐍",
    color: "#3776ab",
    gradient: "linear-gradient(135deg, #3776ab 0%, #2b5c8a 100%)",
    tagline: "Simple, Powerful, Versatile",
    description: "Python is a high-level, interpreted language known for its clean syntax and readability. It's perfect for beginners and experts alike.",
    
    sections: [
      {
        title: "🚀 Introduction",
        content: "Python is a general-purpose programming language that emphasizes code readability and simplicity. Created by Guido van Rossum in 1991, Python has become one of the most popular languages for data science, AI, web development, and automation.",
        highlights: [
          "Named after Monty Python comedy group",
          "#1 language for AI and Machine Learning",
          "Readable syntax that resembles English",
          "Massive standard library ('batteries included')"
        ]
      },
      {
        title: "✨ Key Features",
        items: [
          { icon: "📖", text: "Clean and readable syntax", detail: "Code that's easy to write and understand" },
          { icon: "🎯", text: "Dynamically typed", detail: "No need to declare variable types" },
          { icon: "📦", text: "Extensive standard library", detail: "Built-in modules for common tasks" },
          { icon: "🔧", text: "Multiple paradigms", detail: "OOP, functional, and procedural" },
          { icon: "🌍", text: "Cross-platform", detail: "Write once, run anywhere" },
          { icon: "🤝", text: "Strong community", detail: "PyPI has 400,000+ packages" }
        ]
      },
      {
        title: "💻 Syntax Basics",
        code: `# Variables (no declaration needed)
name = "Alice"
age = 30
pi = 3.14159
is_student = True

# Functions
def greet(name):
    return f"Hello, {name}!"

# Lambda functions
square = lambda x: x ** 2

# Lists (arrays)
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]  # List comprehension

# Dictionaries (objects)
person = {
    "name": "John",
    "age": 30,
    "city": "NYC"
}

# Conditionals
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teen")
else:
    print("Child")

# Loops
for num in numbers:
    print(num)

for i in range(5):  # 0 to 4
    print(i)

# Classes
class Dog:
    def __init__(self, name):
        self.name = name
    
    def bark(self):
        return f"{self.name} says woof!"

# File handling
with open('file.txt', 'r') as f:
    content = f.read()

# Exception handling
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
finally:
    print("Cleanup")`
      },
      {
        title: "🎯 Use Cases",
        items: [
          { icon: "🤖", text: "AI & Machine Learning", detail: "TensorFlow, PyTorch, scikit-learn" },
          { icon: "📊", text: "Data Science", detail: "Pandas, NumPy, Matplotlib for analysis" },
          { icon: "🌐", text: "Web Development", detail: "Django, Flask for robust web apps" },
          { icon: "⚙️", text: "Automation & Scripting", detail: "Automate repetitive tasks easily" },
          { icon: "🔬", text: "Scientific Computing", detail: "SciPy, SymPy for research" },
          { icon: "🎮", text: "Game Development", detail: "Pygame for 2D games" }
        ]
      },
      {
        title: "📖 Learning Path",
        path: [
          { step: "1", title: "Basics", topics: ["Variables & Types", "Control Flow", "Functions & Modules"] },
          { step: "2", title: "Intermediate", topics: ["OOP Concepts", "File I/O", "Error Handling"] },
          { step: "3", title: "Advanced", topics: ["Decorators", "Generators", "Context Managers"] },
          { step: "4", title: "Specialization", topics: ["Data Science", "Web Frameworks", "Machine Learning"] }
        ]
      },
      {
        title: "🔗 Resources",
        resources: [
          { 
            name: "Python.org", 
            url: "https://www.python.org", 
            type: "Official",
            description: "Official Python website and documentation"
          },
          { 
            name: "Real Python", 
            url: "https://realpython.com", 
            type: "Tutorials",
            description: "High-quality Python tutorials and articles"
          },
          { 
            name: "Python for Everybody", 
            url: "https://www.py4e.com", 
            type: "Course",
            description: "Free Python course for beginners"
          },
          { 
            name: "Automate Boring Stuff", 
            url: "https://automatetheboringstuff.com", 
            type: "Book",
            description: "Practical Python programming book"
          }
        ]
      }
    ]
  },

  c: {
    name: "C",
    icon: "⚙️",
    color: "#555555",
    gradient: "linear-gradient(135deg, #555555 0%, #333333 100%)",
    tagline: "The Foundation of Modern Computing",
    description: "C is a powerful, efficient low-level language that provides direct hardware control. It's the backbone of operating systems and embedded systems.",
    
    sections: [
      {
        title: "🚀 Introduction",
        content: "C is a general-purpose programming language created in 1972 by Dennis Ritchie at Bell Labs. It's one of the most influential languages, serving as the foundation for many modern languages like C++, Java, and JavaScript. C provides low-level access to memory and is known for its speed and efficiency.",
        highlights: [
          "Created to develop Unix operating system",
          "Foundation of Linux, Windows, and macOS",
          "Extremely fast and efficient",
          "Direct hardware manipulation"
        ]
      },
      {
        title: "✨ Key Features",
        items: [
          { icon: "⚡", text: "Fast execution", detail: "Close to machine code performance" },
          { icon: "🎯", text: "Low-level memory access", detail: "Pointers for direct memory control" },
          { icon: "🔧", text: "Portable", detail: "Runs on virtually any platform" },
          { icon: "📦", text: "Structured programming", detail: "Clear, modular code organization" },
          { icon: "💪", text: "Powerful", detail: "Full control over system resources" },
          { icon: "📚", text: "Rich library", detail: "Standard library for common operations" }
        ]
      },
      {
        title: "💻 Syntax Basics",
        code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Global variable
#define MAX 100

// Function declaration
int add(int a, int b);

int main() {
    // Variables
    int age = 25;
    float price = 19.99;
    char grade = 'A';
    char name[50] = "John";
    
    // Output
    printf("Hello, World!\\n");
    printf("Name: %s, Age: %d\\n", name, age);
    
    // Input
    int number;
    printf("Enter a number: ");
    scanf("%d", &number);
    
    // Conditionals
    if (age >= 18) {
        printf("Adult\\n");
    } else {
        printf("Minor\\n");
    }
    
    // Loops
    for (int i = 0; i < 5; i++) {
        printf("%d ", i);
    }
    
    // Arrays
    int arr[5] = {1, 2, 3, 4, 5};
    
    // Pointers
    int x = 10;
    int *ptr = &x;
    printf("Value: %d, Address: %p\\n", *ptr, ptr);
    
    // Dynamic memory
    int *dynamic = (int*)malloc(5 * sizeof(int));
    free(dynamic);
    
    return 0;
}

// Function definition
int add(int a, int b) {
    return a + b;
}

// Structures
struct Person {
    char name[50];
    int age;
};`
      },
      {
        title: "🎯 Use Cases",
        items: [
          { icon: "💻", text: "Operating Systems", detail: "Unix, Linux, Windows kernels" },
          { icon: "🔌", text: "Embedded Systems", detail: "IoT devices, microcontrollers" },
          { icon: "🎮", text: "Game Engines", detail: "Performance-critical game code" },
          { icon: "🗄️", text: "Databases", detail: "MySQL, PostgreSQL, SQLite" },
          { icon: "🔐", text: "Compilers", detail: "Building language compilers" },
          { icon: "🚀", text: "System Programming", detail: "Device drivers, system utilities" }
        ]
      },
      {
        title: "📖 Learning Path",
        path: [
          { step: "1", title: "Basics", topics: ["Variables & Types", "Operators", "Control Structures"] },
          { step: "2", title: "Intermediate", topics: ["Functions", "Arrays", "Strings"] },
          { step: "3", title: "Advanced", topics: ["Pointers", "Memory Management", "File I/O"] },
          { step: "4", title: "Expert", topics: ["Data Structures", "System Calls", "Optimization"] }
        ]
      },
      {
        title: "🔗 Resources",
        resources: [
          { 
            name: "Learn C", 
            url: "https://www.learn-c.org", 
            type: "Tutorial",
            description: "Interactive C tutorial"
          },
          { 
            name: "GeeksforGeeks C", 
            url: "https://www.geeksforgeeks.org/c-programming-language/", 
            type: "Reference",
            description: "Comprehensive C programming guide"
          },
          { 
            name: "C Programming.com", 
            url: "https://www.cprogramming.com", 
            type: "Tutorial",
            description: "C tutorials and resources"
          },
          { 
            name: "Harvard CS50", 
            url: "https://cs50.harvard.edu", 
            type: "Course",
            description: "Harvard's introduction to computer science"
          }
        ]
      }
    ]
  },

  cpp: {
    name: "C++",
    icon: "⚡",
    color: "#00599c",
    gradient: "linear-gradient(135deg, #00599c 0%, #004a7c 100%)",
    tagline: "Power and Performance",
    description: "C++ extends C with object-oriented features while maintaining low-level control. Perfect for performance-critical applications.",
    
    sections: [
      {
        title: "🚀 Introduction",
        content: "C++ was created by Bjarne Stroustrup in 1979 as an extension of C. It adds object-oriented programming features while maintaining C's efficiency. C++ is used in game engines, browsers, databases, and any application where performance is critical.",
        highlights: [
          "Extension of C with OOP features",
          "Powers major game engines (Unreal, Unity)",
          "Used in Adobe, Chrome, Firefox",
          "Combines high and low-level programming"
        ]
      },
      {
        title: "✨ Key Features",
        items: [
          { icon: "🎯", text: "Object-Oriented", detail: "Classes, inheritance, polymorphism" },
          { icon: "📦", text: "STL", detail: "Standard Template Library for data structures" },
          { icon: "⚡", text: "High Performance", detail: "Near C-level speed with abstractions" },
          { icon: "🔧", text: "Templates", detail: "Generic programming capabilities" },
          { icon: "🎨", text: "Multiple Paradigms", detail: "OOP, procedural, functional" },
          { icon: "💪", text: "Direct Memory Control", detail: "Pointers and references" }
        ]
      },
      {
        title: "💻 Syntax Basics",
        code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Class definition
class Person {
private:
    string name;
    int age;
    
public:
    // Constructor
    Person(string n, int a) : name(n), age(a) {}
    
    // Method
    void introduce() {
        cout << "Hi, I'm " << name << endl;
    }
    
    // Getter
    int getAge() { return age; }
};

// Inheritance
class Student : public Person {
private:
    string school;
    
public:
    Student(string n, int a, string s) 
        : Person(n, a), school(s) {}
};

int main() {
    // Variables
    int number = 42;
    double pi = 3.14159;
    string text = "Hello";
    
    // Auto keyword (C++11)
    auto x = 10;  // int
    auto y = 3.14;  // double
    
    // Vectors (dynamic arrays)
    vector<int> numbers = {1, 2, 3, 4, 5};
    numbers.push_back(6);
    
    // Range-based for loop (C++11)
    for (int num : numbers) {
        cout << num << " ";
    }
    
    // Smart pointers (C++11)
    unique_ptr<Person> p = 
        make_unique<Person>("Alice", 25);
    
    // Lambda expressions (C++11)
    auto add = [](int a, int b) {
        return a + b;
    };
    
    // References
    int a = 10;
    int &ref = a;  // ref is alias for a
    
    return 0;
}`
      },
      {
        title: "🎯 Use Cases",
        items: [
          { icon: "🎮", text: "Game Development", detail: "Unreal Engine, Unity internals" },
          { icon: "🖥️", text: "System Software", detail: "Operating systems, drivers" },
          { icon: "🌐", text: "Web Browsers", detail: "Chrome, Firefox, Edge" },
          { icon: "📊", text: "High-Frequency Trading", detail: "Ultra-low latency systems" },
          { icon: "🎬", text: "Graphics Software", detail: "Adobe suite, 3D modeling" },
          { icon: "🤖", text: "Robotics & AI", detail: "Performance-critical ML" }
        ]
      },
      {
        title: "📖 Learning Path",
        path: [
          { step: "1", title: "Basics", topics: ["C++ Syntax", "I/O Streams", "Control Flow"] },
          { step: "2", title: "OOP", topics: ["Classes & Objects", "Inheritance", "Polymorphism"] },
          { step: "3", title: "Advanced", topics: ["STL", "Templates", "Smart Pointers"] },
          { step: "4", title: "Modern C++", topics: ["C++11/14/17/20", "Move Semantics", "Concurrency"] }
        ]
      },
      {
        title: "🔗 Resources",
        resources: [
          { 
            name: "cplusplus.com", 
            url: "https://www.cplusplus.com", 
            type: "Reference",
            description: "C++ reference and tutorials"
          },
          { 
            name: "learncpp.com", 
            url: "https://www.learncpp.com", 
            type: "Tutorial",
            description: "Free C++ tutorials"
          },
          { 
            name: "C++ Reference", 
            url: "https://en.cppreference.com/w/", 
            type: "Reference",
            description: "Comprehensive C++ reference"
          },
          { 
            name: "CppCon", 
            url: "https://www.youtube.com/c/CppCon", 
            type: "Videos",
            description: "C++ conference talks and videos"
          }
        ]
      }
    ]
  },

  java: {
    name: "Java",
    icon: "☕",
    color: "#007396",
    gradient: "linear-gradient(135deg, #007396 0%, #005a7a 100%)",
    tagline: "Write Once, Run Anywhere",
    description: "Java is a robust, object-oriented language that runs on billions of devices. Known for its portability and enterprise-grade applications.",
    
    sections: [
      {
        title: "🚀 Introduction",
        content: "Java was created by James Gosling at Sun Microsystems in 1995. It's designed to be platform-independent through the Java Virtual Machine (JVM). Java is one of the most popular languages for enterprise applications, Android development, and large-scale systems.",
        highlights: [
          "Runs on 3 billion devices",
          "#1 language for Android apps",
          "Platform-independent (JVM)",
          "Strong typing and automatic memory management"
        ]
      },
      {
        title: "✨ Key Features",
        items: [
          { icon: "🌍", text: "Platform Independence", detail: "Write once, run anywhere (JVM)" },
          { icon: "🎯", text: "Object-Oriented", detail: "Everything is an object" },
          { icon: "🔒", text: "Strongly Typed", detail: "Type safety at compile time" },
          { icon: "♻️", text: "Automatic Memory Management", detail: "Garbage collection" },
          { icon: "🔐", text: "Secure", detail: "Built-in security features" },
          { icon: "📚", text: "Rich API", detail: "Comprehensive standard library" }
        ]
      },
      {
        title: "💻 Syntax Basics",
        code: `// Package declaration
package com.example;

// Imports
import java.util.*;

// Class definition
public class Person {
    // Fields (private)
    private String name;
    private int age;
    
    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    // Method
    public void introduce() {
        System.out.println("Hi, I'm " + name);
    }
}

// Main class
public class Main {
    public static void main(String[] args) {
        // Variables
        int number = 42;
        double pi = 3.14159;
        String text = "Hello";
        boolean flag = true;
        
        // Arrays
        int[] numbers = {1, 2, 3, 4, 5};
        
        // ArrayList (dynamic array)
        ArrayList<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        
        // HashMap (dictionary)
        HashMap<String, Integer> ages = new HashMap<>();
        ages.put("Alice", 25);
        
        // For-each loop
        for (String name : names) {
            System.out.println(name);
        }
        
        // Try-catch
        try {
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        // Lambda (Java 8+)
        List<Integer> nums = Arrays.asList(1, 2, 3);
        nums.forEach(n -> System.out.println(n));
    }
}`
      },
      {
        title: "🎯 Use Cases",
        items: [
          { icon: "🏢", text: "Enterprise Applications", detail: "Spring Framework, Jakarta EE" },
          { icon: "📱", text: "Android Development", detail: "Native Android apps" },
          { icon: "🌐", text: "Web Applications", detail: "Spring Boot, JSP, Servlets" },
          { icon: "💼", text: "Financial Systems", detail: "Banking, trading platforms" },
          { icon: "🔬", text: "Scientific Applications", detail: "Research and analysis" },
          { icon: "☁️", text: "Cloud Services", detail: "Microservices architecture" }
        ]
      },
      {
        title: "📖 Learning Path",
        path: [
          { step: "1", title: "Basics", topics: ["Syntax & Types", "OOP Concepts", "Collections"] },
          { step: "2", title: "Intermediate", topics: ["Exception Handling", "I/O Streams", "Multithreading"] },
          { step: "3", title: "Advanced", topics: ["Generics", "Lambda & Streams", "Design Patterns"] },
          { step: "4", title: "Frameworks", topics: ["Spring Boot", "Android", "JavaFX"] }
        ]
      },
      {
        title: "🔗 Resources",
        resources: [
          { 
            name: "Oracle Java Docs", 
            url: "https://docs.oracle.com/javase/", 
            type: "Official",
            description: "Official Java documentation"
          },
          { 
            name: "JavaTpoint", 
            url: "https://www.javatpoint.com/java-tutorial", 
            type: "Tutorial",
            description: "Java tutorials for beginners"
          },
          { 
            name: "Baeldung", 
            url: "https://www.baeldung.com", 
            type: "Advanced",
            description: "Advanced Java tutorials and guides"
          },
          { 
            name: "GeeksforGeeks Java", 
            url: "https://www.geeksforgeeks.org/java/", 
            type: "Reference",
            description: "Java programming articles and examples"
          }
        ]
      }
    ]
  },

  typescript: {
    name: "TypeScript",
    icon: "🔷",
    color: "#3178c6",
    gradient: "linear-gradient(135deg, #3178c6 0%, #2b6cb0 100%)",
    tagline: "JavaScript with Superpowers",
    description: "TypeScript adds static typing to JavaScript, making code more maintainable and catching errors early.",
    
    sections: [
      {
        title: "🚀 Introduction",
        content: "TypeScript is a superset of JavaScript developed by Microsoft. It adds optional static typing, interfaces, and other features to JavaScript while compiling down to plain JavaScript. TypeScript helps catch errors during development and improves code quality.",
        highlights: [
          "Developed by Microsoft in 2012",
          "Superset of JavaScript",
          "Static typing for better tooling",
          "Used by Angular, Vue 3, and many others"
        ]
      },
      {
        title: "✨ Key Features",
        items: [
          { icon: "🎯", text: "Static Typing", detail: "Catch errors before runtime" },
          { icon: "🔧", text: "Better IDE Support", detail: "Autocomplete and refactoring" },
          { icon: "📦", text: "Interfaces", detail: "Define object shapes" },
          { icon: "🎨", text: "Type Inference", detail: "Smart type detection" },
          { icon: "⚙️", text: "Compiles to JS", detail: "Works anywhere JavaScript runs" },
          { icon: "📚", text: "Modern Features", detail: "Latest ECMAScript features" }
        ]
      },
      {
        title: "💻 Syntax Basics",
        code: `// Type annotations
let name: string = "Alice";
let age: number = 25;
let isStudent: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Interfaces
interface Person {
  name: string;
  age: number;
  email?: string;  // Optional property
}

// Functions with types
function greet(person: Person): string {
  return \`Hello, \${person.name}!\`;
}

// Arrow function with types
const add = (a: number, b: number): number => a + b;

// Type aliases
type ID = string | number;
type User = {
  id: ID;
  username: string;
};

// Generics
function identity<T>(arg: T): T {
  return arg;
}

// Classes
class Dog {
  private name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  bark(): void {
    console.log(\`\${this.name} says woof!\`);
  }
}

// Union types
let value: string | number;
value = "hello";
value = 42;

// Enums
enum Color {
  Red,
  Green,
  Blue
}

// Type guards
function isString(value: any): value is string {
  return typeof value === "string";
}`
      },
      {
        title: "🎯 Use Cases",
        items: [
          { icon: "⚛️", text: "React Development", detail: "Type-safe React components" },
          { icon: "🅰️", text: "Angular", detail: "Built with TypeScript" },
          { icon: "🟢", text: "Node.js Backend", detail: "Type-safe server code" },
          { icon: "📱", text: "React Native", detail: "Mobile app development" },
          { icon: "🎮", text: "Game Development", detail: "Phaser with TypeScript" },
          { icon: "🔧", text: "Tooling", detail: "Build tools and CLIs" }
        ]
      },
      {
        title: "📖 Learning Path",
        path: [
          { step: "1", title: "JavaScript First", topics: ["Learn JS Fundamentals", "ES6+ Features", "Async Programming"] },
          { step: "2", title: "TS Basics", topics: ["Type Annotations", "Interfaces", "Functions"] },
          { step: "3", title: "Advanced", topics: ["Generics", "Utility Types", "Type Guards"] },
          { step: "4", title: "Real World", topics: ["React + TS", "Node + TS", "Testing"] }
        ]
      },
      {
        title: "🔗 Resources",
        resources: [
          { 
            name: "TypeScript Docs", 
            url: "https://www.typescriptlang.org", 
            type: "Official",
            description: "Official TypeScript documentation"
          },
          { 
            name: "TypeScript Deep Dive", 
            url: "https://basarat.gitbook.io/typescript/", 
            type: "Book",
            description: "Free TypeScript book"
          },
          { 
            name: "Total TypeScript", 
            url: "https://totaltypescript.com", 
            type: "Course",
            description: "Comprehensive TypeScript course"
          },
          { 
            name: "TypeScript Exercises", 
            url: "https://typescript-exercises.github.io/", 
            type: "Interactive",
            description: "Interactive TypeScript exercises"
          }
        ]
      }
    ]
  },

  php: {
    name: "PHP",
    icon: "🐘",
    color: "#777bb4",
    gradient: "linear-gradient(135deg, #777bb4 0%, #6a6da0 100%)",
    tagline: "The Server-Side Powerhouse",
    description: "PHP powers over 75% of the web, including WordPress and Facebook. It's perfect for dynamic websites and server-side applications.",
    
    sections: [
      {
        title: "🚀 Introduction",
        content: "PHP (Hypertext Preprocessor) is a server-side scripting language created in 1994. It's embedded in HTML and executes on the server. PHP is widely used for web development and powers major platforms like WordPress, Wikipedia, and Facebook.",
        highlights: [
          "Powers 77% of websites with known server-side language",
          "WordPress uses PHP (43% of all websites)",
          "Easy to learn and deploy",
          "Huge community and frameworks"
        ]
      },
      {
        title: "✨ Key Features",
        items: [
          { icon: "🌐", text: "Server-Side Execution", detail: "Runs on the server, outputs HTML" },
          { icon: "🔧", text: "Easy Integration", detail: "Works with all major databases" },
          { icon: "📦", text: "Rich Frameworks", detail: "Laravel, Symfony, CodeIgniter" },
          { icon: "💰", text: "Free & Open Source", detail: "No licensing costs" },
          { icon: "🚀", text: "Quick Development", detail: "Rapid prototyping" },
          { icon: "📚", text: "Extensive Documentation", detail: "Great learning resources" }
        ]
      },
      {
        title: "💻 Syntax Basics",
        code: `<?php
// Variables (start with $)
$name = "Alice";
$age = 25;
$price = 19.99;
$isActive = true;

// Output
echo "Hello, World!";
echo "Name: $name, Age: $age";

// Arrays
$numbers = [1, 2, 3, 4, 5];
$person = [
    "name" => "John",
    "age" => 30,
    "city" => "NYC"
];

// Functions
function greet($name) {
    return "Hello, $name!";
}

// Arrow functions (PHP 7.4+)
$add = fn($a, $b) => $a + $b;

// Conditionals
if ($age >= 18) {
    echo "Adult";
} else {
    echo "Minor";
}

// Loops
foreach ($numbers as $num) {
    echo $num;
}

for ($i = 0; $i < 5; $i++) {
    echo $i;
}

// Classes (OOP)
class Person {
    private $name;
    private $age;
    
    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
    }
    
    public function introduce() {
        return "Hi, I'm {$this->name}";
    }
}

// Database (PDO)
$pdo = new PDO('mysql:host=localhost;dbname=test', 'user', 'pass');
$stmt = $pdo->query('SELECT * FROM users');
$users = $stmt->fetchAll();
?>`
      },
      {
        title: "🎯 Use Cases",
        items: [
          { icon: "🌐", text: "Web Development", detail: "Dynamic websites and web apps" },
          { icon: "📝", text: "Content Management", detail: "WordPress, Drupal, Joomla" },
          { icon: "🛒", text: "E-commerce", detail: "Magento, WooCommerce" },
          { icon: "🔐", text: "Authentication Systems", detail: "User login and security" },
          { icon: "📊", text: "Data Processing", detail: "Server-side data manipulation" },
          { icon: "🔌", text: "REST APIs", detail: "Building web services" }
        ]
      },
      {
        title: "📖 Learning Path",
        path: [
          { step: "1", title: "Basics", topics: ["Syntax & Variables", "Arrays", "Functions"] },
          { step: "2", title: "Web Dev", topics: ["Forms", "Sessions", "Cookies"] },
          { step: "3", title: "Database", topics: ["MySQL", "PDO", "CRUD Operations"] },
          { step: "4", title: "Framework", topics: ["Laravel", "MVC Pattern", "APIs"] }
        ]
      },
      {
        title: "🔗 Resources",
        resources: [
          { 
            name: "PHP.net", 
            url: "https://www.php.net", 
            type: "Official",
            description: "Official PHP documentation"
          },
          { 
            name: "PHP The Right Way", 
            url: "https://phptherightway.com", 
            type: "Guide",
            description: "PHP best practices guide"
          },
          { 
            name: "Laracasts", 
            url: "https://laracasts.com", 
            type: "Videos",
            description: "PHP and Laravel video tutorials"
          },
          { 
            name: "W3Schools PHP", 
            url: "https://www.w3schools.com/php/", 
            type: "Tutorial",
            description: "PHP tutorials and reference"
          }
        ]
      }
    ]
  },

  go: {
    name: "Go",
    icon: "🐹",
    color: "#00add8",
    gradient: "linear-gradient(135deg, #00add8 0%, #0099c3 100%)",
    tagline: "Simple, Fast, Reliable",
    description: "Go (Golang) is Google's language for building fast, concurrent systems. Perfect for cloud services and distributed systems.",
    
    sections: [
      {
        title: "🚀 Introduction",
        content: "Go was created at Google in 2009 by Robert Griesemer, Rob Pike, and Ken Thompson. It's designed for simplicity, efficiency, and excellent concurrency support. Go is widely used for cloud services, DevOps tools, and backend systems.",
        highlights: [
          "Created by Google engineers",
          "Built-in concurrency (goroutines)",
          "Fast compilation and execution",
          "Used by Docker, Kubernetes, Terraform"
        ]
      },
      {
        title: "✨ Key Features",
        items: [
          { icon: "⚡", text: "Fast Compilation", detail: "Compiles to native code quickly" },
          { icon: "🔄", text: "Built-in Concurrency", detail: "Goroutines and channels" },
          { icon: "📦", text: "Simple Syntax", detail: "Easy to learn and read" },
          { icon: "🗑️", text: "Garbage Collection", detail: "Automatic memory management" },
          { icon: "📚", text: "Standard Library", detail: "Rich built-in packages" },
          { icon: "🔧", text: "Static Typing", detail: "Type safety with inference" }
        ]
      },
      {
        title: "💻 Syntax Basics",
        code: `package main

import (
    "fmt"
    "time"
)

// Variables
var globalVar = "I'm global"

// Constants
const PI = 3.14159

// Function
func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

// Multiple return values
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

// Struct (like a class)
type Person struct {
    Name string
    Age  int
}

// Method on struct
func (p Person) Introduce() {
    fmt.Printf("Hi, I'm %s\\n", p.Name)
}

// Interface
type Speaker interface {
    Speak() string
}

// Goroutine (concurrency)
func main() {
    // Variables
    name := "Alice"  // := for type inference
    age := 25
    
    // Slice (dynamic array)
    numbers := []int{1, 2, 3, 4, 5}
    numbers = append(numbers, 6)
    
    // Map (dictionary)
    ages := map[string]int{
        "Alice": 25,
        "Bob": 30,
    }
    
    // For loop (only loop in Go)
    for i := 0; i < 5; i++ {
        fmt.Println(i)
    }
    
    // Range loop
    for _, num := range numbers {
        fmt.Println(num)
    }
    
    // Goroutine
    go func() {
        fmt.Println("Running concurrently!")
    }()
    
    // Channels
    ch := make(chan string)
    go func() {
        ch <- "Hello from goroutine"
    }()
    msg := <-ch
    
    time.Sleep(time.Second)
}`
      },
      {
        title: "🎯 Use Cases",
        items: [
          { icon: "☁️", text: "Cloud Services", detail: "Microservices, APIs" },
          { icon: "🔧", text: "DevOps Tools", detail: "Docker, Kubernetes, Terraform" },
          { icon: "🌐", text: "Web Servers", detail: "High-performance backends" },
          { icon: "📊", text: "Data Processing", detail: "Stream processing, ETL" },
          { icon: "🔌", text: "Network Tools", detail: "Proxies, load balancers" },
          { icon: "🤖", text: "CLI Applications", detail: "Command-line tools" }
        ]
      },
      {
        title: "📖 Learning Path",
        path: [
          { step: "1", title: "Basics", topics: ["Syntax", "Types", "Functions"] },
          { step: "2", title: "Core Concepts", topics: ["Structs", "Interfaces", "Error Handling"] },
          { step: "3", title: "Concurrency", topics: ["Goroutines", "Channels", "Select"] },
          { step: "4", title: "Real World", topics: ["Web Servers", "Testing", "Deployment"] }
        ]
      },
      {
        title: "🔗 Resources",
        resources: [
          { 
            name: "Go.dev", 
            url: "https://go.dev", 
            type: "Official",
            description: "Official Go programming language website"
          },
          { 
            name: "A Tour of Go", 
            url: "https://go.dev/tour", 
            type: "Interactive",
            description: "Interactive Go tutorial"
          },
          { 
            name: "Go by Example", 
            url: "https://gobyexample.com", 
            type: "Examples",
            description: "Go programming examples"
          },
          { 
            name: "Effective Go", 
            url: "https://go.dev/doc/effective_go", 
            type: "Guide",
            description: "Go best practices guide"
          }
        ]
      }
    ]
  },

  rust: {
    name: "Rust",
    icon: "🦀",
    color: "#ce422b",
    gradient: "linear-gradient(135deg, #ce422b 0%, #b53824 100%)",
    tagline: "Safe, Fast, Concurrent",
    description: "Rust provides memory safety without garbage collection. Perfect for systems programming where performance and reliability are critical.",
    
    sections: [
      {
        title: "🚀 Introduction",
        content: "Rust is a systems programming language focused on safety, speed, and concurrency. Created by Mozilla in 2010, Rust prevents memory bugs and data races at compile time. It's increasingly used in operating systems, game engines, and performance-critical applications.",
        highlights: [
          "Memory safety without garbage collection",
          "Zero-cost abstractions",
          "Most loved language (Stack Overflow)",
          "Used by Microsoft, Amazon, Google"
        ]
      },
      {
        title: "✨ Key Features",
        items: [
          { icon: "🔒", text: "Memory Safety", detail: "No null pointers or data races" },
          { icon: "⚡", text: "Zero-Cost Abstractions", detail: "High-level code, low-level performance" },
          { icon: "🎯", text: "Ownership System", detail: "Unique memory management model" },
          { icon: "🔧", text: "Pattern Matching", detail: "Powerful control flow" },
          { icon: "📦", text: "Cargo", detail: "Excellent package manager" },
          { icon: "🔄", text: "Fearless Concurrency", detail: "Thread safety guaranteed" }
        ]
      },
      {
        title: "💻 Syntax Basics",
        code: `// Variables (immutable by default)
let x = 5;
let mut y = 10;  // Mutable variable

// Types
let age: i32 = 25;
let price: f64 = 19.99;
let name: &str = "Alice";
let active: bool = true;

// Functions
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// Struct
struct Person {
    name: String,
    age: u32,
}

// Implementation
impl Person {
    fn new(name: String, age: u32) -> Person {
        Person { name, age }
    }
    
    fn introduce(&self) {
        println!("Hi, I'm {}", self.name);
    }
}

// Enum
enum Result<T, E> {
    Ok(T),
    Err(E),
}

// Pattern matching
fn main() {
    let number = 7;
    
    match number {
        1 => println!("One"),
        2..=5 => println!("Between 2 and 5"),
        _ => println!("Something else"),
    }
    
    // Vectors (arrays)
    let mut vec = vec![1, 2, 3];
    vec.push(4);
    
    // Iterators
    let doubled: Vec<i32> = vec.iter()
        .map(|x| x * 2)
        .collect();
    
    // Option type (no null!)
    let maybe: Option<i32> = Some(5);
    if let Some(val) = maybe {
        println!("Got: {}", val);
    }
    
    // Error handling
    let result: Result<i32, String> = Ok(42);
    match result {
        Ok(val) => println!("Success: {}", val),
        Err(e) => println!("Error: {}", e),
    }
}`
      },
      {
        title: "🎯 Use Cases",
        items: [
          { icon: "💻", text: "Systems Programming", detail: "OS kernels, device drivers" },
          { icon: "🌐", text: "Web Assembly", detail: "High-performance web apps" },
          { icon: "🎮", text: "Game Engines", detail: "Performance-critical gaming" },
          { icon: "⛓️", text: "Blockchain", detail: "Cryptocurrency implementations" },
          { icon: "🔐", text: "Embedded Systems", detail: "IoT and hardware" },
          { icon: "🚀", text: "CLI Tools", detail: "Fast command-line utilities" }
        ]
      },
      {
        title: "📖 Learning Path",
        path: [
          { step: "1", title: "Basics", topics: ["Variables", "Data Types", "Functions"] },
          { step: "2", title: "Ownership", topics: ["Borrowing", "References", "Lifetimes"] },
          { step: "3", title: "Advanced", topics: ["Traits", "Generics", "Error Handling"] },
          { step: "4", title: "Real World", topics: ["Async/Await", "Macros", "Testing"] }
        ]
      },
      {
        title: "🔗 Resources",
        resources: [
          { 
            name: "The Rust Book", 
            url: "https://doc.rust-lang.org/book/", 
            type: "Official",
            description: "Official Rust programming book"
          },
          { 
            name: "Rust by Example", 
            url: "https://doc.rust-lang.org/rust-by-example/", 
            type: "Examples",
            description: "Learn Rust with examples"
          },
          { 
            name: "Rustlings", 
            url: "https://github.com/rust-lang/rustlings", 
            type: "Interactive",
            description: "Small Rust exercises"
          },
          { 
            name: "Exercism Rust", 
            url: "https://exercism.org/tracks/rust", 
            type: "Exercises",
            description: "Rust coding exercises and mentorship"
          }
        ]
      }
    ]
  },

  ruby: {
    name: "Ruby",
    icon: "💎",
    color: "#cc342d",
    gradient: "linear-gradient(135deg, #cc342d 0%, #b32b25 100%)",
    tagline: "Programmer Happiness",
    description: "Ruby is designed for programmer happiness with elegant syntax. Powers Ruby on Rails, one of the most productive web frameworks.",
    
    sections: [
      {
        title: "🚀 Introduction",
        content: "Ruby is a dynamic, object-oriented language created by Yukihiro Matsumoto in 1995. It emphasizes simplicity and productivity with an elegant syntax. Ruby on Rails revolutionized web development and Ruby remains popular for web applications.",
        highlights: [
          "Designed for developer happiness",
          "Everything is an object",
          "Ruby on Rails framework",
          "Used by GitHub, Shopify, Airbnb"
        ]
      },
      {
        title: "✨ Key Features",
        items: [
          { icon: "😊", text: "Elegant Syntax", detail: "Reads like English" },
          { icon: "🎯", text: "Pure OOP", detail: "Everything is an object" },
          { icon: "🔧", text: "Metaprogramming", detail: "Code that writes code" },
          { icon: "💎", text: "Ruby Gems", detail: "Rich package ecosystem" },
          { icon: "🚂", text: "Rails Framework", detail: "Convention over configuration" },
          { icon: "📚", text: "Dynamic Typing", detail: "Flexible and expressive" }
        ]
      },
      {
        title: "💻 Syntax Basics",
        code: `# Variables
name = "Alice"
age = 25
price = 19.99

# Output
puts "Hello, World!"
puts "Name: #{name}, Age: #{age}"

# Functions (methods)
def greet(name)
  "Hello, #{name}!"
end

# Blocks and iterators
[1, 2, 3, 4, 5].each do |num|
  puts num
end

# Short form
numbers = [1, 2, 3, 4, 5]
doubled = numbers.map { |n| n * 2 }

# Hashes (dictionaries)
person = {
  name: "John",
  age: 30,
  city: "NYC"
}

# Classes
class Person
  attr_accessor :name, :age
  
  def initialize(name, age)
    @name = name
    @age = age
  end
  
  def introduce
    "Hi, I'm #{@name}"
  end
end

# Conditionals
if age >= 18
  puts "Adult"
elsif age >= 13
  puts "Teen"
else
  puts "Child"
end

# Unless (inverse if)
unless raining
  go_outside
end

# Symbols
status = :active  # More efficient than strings

# Ranges
(1..5).each { |i| puts i }

# Case statement
case grade
when 'A'
  puts "Excellent"
when 'B'
  puts "Good"
else
  puts "Keep trying"
end`
      },
      {
        title: "🎯 Use Cases",
        items: [
          { icon: "🌐", text: "Web Development", detail: "Ruby on Rails applications" },
          { icon: "📊", text: "Data Processing", detail: "Scripting and automation" },
          { icon: "🔧", text: "DevOps", detail: "Chef, Puppet for configuration" },
          { icon: "🧪", text: "Testing", detail: "RSpec, Cucumber frameworks" },
          { icon: "🎨", text: "Prototyping", detail: "Rapid application development" },
          { icon: "📝", text: "Static Sites", detail: "Jekyll for blogs" }
        ]
      },
      {
        title: "📖 Learning Path",
        path: [
          { step: "1", title: "Basics", topics: ["Syntax", "Variables", "Methods"] },
          { step: "2", title: "OOP", topics: ["Classes", "Modules", "Inheritance"] },
          { step: "3", title: "Advanced", topics: ["Blocks", "Metaprogramming", "Gems"] },
          { step: "4", title: "Rails", topics: ["MVC", "ActiveRecord", "RESTful APIs"] }
        ]
      },
      {
        title: "🔗 Resources",
        resources: [
          { 
            name: "Ruby-lang.org", 
            url: "https://www.ruby-lang.org", 
            type: "Official",
            description: "Official Ruby programming language website"
          },
          { 
            name: "Try Ruby", 
            url: "https://try.ruby-lang.org", 
            type: "Interactive",
            description: "Interactive Ruby tutorial"
          },
          { 
            name: "Ruby Koans", 
            url: "http://rubykoans.com", 
            type: "Learning",
            description: "Learn Ruby through testing"
          },
          { 
            name: "Rails Guides", 
            url: "https://guides.rubyonrails.org", 
            type: "Framework",
            description: "Official Ruby on Rails guides"
          }
        ]
      }
    ]
  }
};

const LanguageLearning = ({ isOpen, onClose, language }) => {
  const [activeSection, setActiveSection] = useState(0);
  
  if (!isOpen) return null;

  const data = languageData[language] || languageData.javascript;

  // Handle resource link click
  const handleResourceClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle code copy
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  return (
    <div className="learning-overlay" onClick={onClose}>
      <div className="learning-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="learning-header" style={{ borderColor: data.color, background: data.gradient }}>
          <div className="learning-header-content">
            <div className="learning-icon">{data.icon}</div>
            <div className="learning-title-section">
              <h1 className="learning-title" style={{ color: '#ffffff' }}>
                Learn {data.name}
              </h1>
              <p className="learning-tagline">{data.tagline}</p>
              <p className="learning-description">{data.description}</p>
            </div>
          </div>
          <button className="learning-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="learning-nav">
          {data.sections.map((section, index) => (
            <button
              key={index}
              className={`learning-nav-item ${activeSection === index ? 'active' : ''}`}
              onClick={() => setActiveSection(index)}
              style={{
                borderColor: activeSection === index ? data.color : 'transparent',
                background: activeSection === index ? `${data.color}15` : 'transparent',
                color: activeSection === index ? data.color : 'inherit'
              }}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="learning-content">
          {data.sections.map((section, index) => (
            <div
              key={index}
              className={`learning-section ${activeSection === index ? 'active' : ''}`}
            >
              <h2 className="section-title" style={{ color: data.color }}>
                {section.title}
              </h2>

              {section.content && (
                <p className="section-content">{section.content}</p>
              )}

              {section.highlights && (
                <div className="highlights-grid">
                  {section.highlights.map((highlight, i) => (
                    <div key={i} className="highlight-card" style={{ borderColor: `${data.color}30` }}>
                      <div className="highlight-icon" style={{ background: `${data.color}20`, color: data.color }}>
                        ✓
                      </div>
                      <p>{highlight}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.items && (
                <div className="features-grid">
                  {section.items.map((item, i) => (
                    <div key={i} className="feature-card" style={{ borderLeftColor: data.color }}>
                      <div className="feature-icon">{item.icon}</div>
                      <div className="feature-content">
                        <h4>{item.text}</h4>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.code && (
                <div className="code-block">
                  <div className="code-header" style={{ background: data.color }}>
                    <span>Example Code</span>
                    <button 
                      className="code-copy"
                      onClick={() => handleCopyCode(section.code)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      Copy
                    </button>
                  </div>
                  <pre className="code-content">{section.code}</pre>
                </div>
              )}

              {section.path && (
                <div className="learning-path">
                  {section.path.map((step, i) => (
                    <div key={i} className="path-step">
                      <div className="path-number" style={{ background: data.color }}>
                        {step.step}
                      </div>
                      <div className="path-content">
                        <h4>{step.title}</h4>
                        <ul>
                          {step.topics.map((topic, j) => (
                            <li key={j}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.resources && (
                <div className="resources-grid">
                  {section.resources.map((resource, i) => (
                    <div 
                      key={i} 
                      className="resource-card" 
                      style={{ borderColor: `${data.color}40` }}
                      onClick={() => handleResourceClick(resource.url)}
                    >
                      <div className="resource-type" style={{ background: `${data.color}20`, color: data.color }}>
                        {resource.type}
                      </div>
                      <h4>{resource.name}</h4>
                      <p className="resource-description">{resource.description}</p>
                      <p className="resource-url">{resource.url.replace('https://', '')}</p>
                      <div className="resource-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H7M17 7V17"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="learning-footer">
          <button 
            className="start-coding-btn"
            style={{ background: data.gradient }}
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            Start Coding in {data.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageLearning;
