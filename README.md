# Data Analytics Practice Repository

This repository contains practice code and projects for learning data analytics, Python programming, and web development concepts.

## 📁 Repository Structure

```
dataanalystics practice/
├── README.md                           # This file
├── waste_management_syssssstem.py     # FastAPI waste management system
├── waste_management.db                # SQLite database for the system
├── myarray.npy                        # NumPy array data file
└── sinha/                             # Additional files and temporary data
```

## 🐍 Python Concepts Covered

### Object-Oriented Programming (OOP)
- **Classes and Objects**: Basic class definition and object instantiation
- **Inheritance**: Parent-child class relationships and method inheritance
- **Method Overriding**: Customizing inherited methods in child classes
- **The `self` Parameter**: Understanding instance reference in class methods
- **Constructors**: Using `__init__` method for object initialization
- **Super() Function**: Calling parent class methods from child classes

### Data Analysis Libraries

#### NumPy
- Array creation and manipulation
- Array shapes and reshaping operations
- Array initialization methods:
  - `np.zeros()` - Create arrays filled with zeros
  - `np.full()` - Create arrays filled with specific values
  - `np.arange()` - Create arrays with sequential values
  - `np.random.randint()` - Create arrays with random integers
- Array stacking operations:
  - `np.vstack()` - Vertical stacking
  - `np.hstack()` - Horizontal stacking
  - `np.column_stack()` - Column-wise stacking

#### Pandas
- DataFrame creation and manipulation
- Reading CSV files with `pd.read_csv()`
- DataFrame inspection with `.head()`
- Data structure understanding and basic operations

## 🌐 Web Development Project

### Waste Management System
A comprehensive FastAPI-based web application featuring:

#### Features
- **User Authentication**: JWT-based authentication system
- **Role-based Access**: Citizens, Field Staff, and Admin roles
- **Issue Reporting**: Citizens can report waste management issues
- **Task Assignment**: Staff can be assigned to resolve issues
- **IoT Integration**: Smart waste bin monitoring
- **Reward System**: Points-based incentive system for citizens
- **Real-time Notifications**: Email notification system

#### Technologies Used
- **FastAPI**: Modern web framework for building APIs
- **SQLAlchemy**: Database ORM for data management
- **SQLite**: Lightweight database for data storage
- **JWT**: Secure authentication tokens
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for running the application

#### Database Models
- **Users**: Authentication and role management
- **Issues**: Waste management problem tracking
- **Reward Points**: Incentive system tracking
- **Waste Bins**: IoT-enabled bin monitoring

## 🚀 Getting Started

### Prerequisites
```bash
pip install numpy pandas fastapi sqlalchemy uvicorn python-jose[cryptography] passlib[bcrypt]
```

### Running the Waste Management System
```bash
python waste_management_syssssstem.py
```
The API will be available at `http://127.0.0.1:8000`

### API Documentation
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## 📚 Learning Objectives

This repository demonstrates proficiency in:
- Python fundamentals and OOP concepts
- Data manipulation with NumPy and Pandas
- Web API development with FastAPI
- Database design and management
- Authentication and authorization
- Real-world application development

## 🔧 Common Issues and Solutions

### Python Class Issues
- **Indentation Errors**: Ensure methods are properly indented within classes
- **Method Definition**: Methods should be defined at class level, not nested within other methods
- **Self Parameter**: Always include `self` as the first parameter in instance methods

### Data Analysis Issues
- **Print Output**: Remember to use `print()` function to display results
- **DataFrame Creation**: Use correct syntax `pd.DataFrame()` (capital 'F')
- **Array Operations**: Assign results to variables or print them to see output

## 📈 Future Enhancements

- [ ] Add data visualization with Matplotlib/Plotly
- [ ] Implement machine learning models for waste prediction
- [ ] Add frontend interface using React or Streamlit
- [ ] Integrate with real IoT sensors
- [ ] Add comprehensive testing suite
- [ ] Deploy to cloud platform (AWS/Azure/GCP)

## 👤 Author

**Sameer Sinha Khurram Sreerag ADITYA SAHIL**
- Learning data analytics and web development
- Practicing Python programming concepts
- Building real-world applications

---
MIT License

Copyright (c) 2025 Sameer Sinha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*This repository serves as a comprehensive learning resource for data analytics and web development using Python.*