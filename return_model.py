"""
Product Return Likelihood Prediction using Random Forest
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import pickle
import os


class ReturnPredictor:
    def __init__(self):
        """Initialize the product return prediction model"""
        self.model = None
        self.numerical_features = [
            'price', 'freight_value', 'product_name_lenght',
            'product_description_lenght', 'product_photos_qty',
            'product_weight_g', 'product_length_cm',
            'product_height_cm', 'product_width_cm'
        ]
        self.categorical_features = ['product_category_name']
        
    def train(self, return_data):
        """Train the Random Forest return prediction model"""
        print("\n=== Training Product Return Prediction Model ===")
        
        # Features and target
        X = return_data.drop('is_likely_return', axis=1)
        y = return_data['is_likely_return']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Create preprocessor
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), self.numerical_features),
                ('cat', OneHotEncoder(handle_unknown='ignore'), self.categorical_features)
            ])
        
        # Create pipeline
        self.model = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(
                random_state=42,
                class_weight='balanced',
                n_estimators=100,
                n_jobs=-1
            ))
        ])
        
        # Train model
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        print(f"Training accuracy: {train_score:.4f}")
        print(f"Testing accuracy: {test_score:.4f}")
        
        print(f"\nReturn distribution in training:")
        print(y_train.value_counts())
        
        return self.model
    
    def predict(self, product_data):
        """Predict return likelihood for products"""
        if self.model is None:
            raise ValueError("Model not trained yet. Call train() first.")
        
        # Ensure input is a DataFrame
        if isinstance(product_data, pd.Series):
            product_data = product_data.to_frame().T
        
        # Make predictions
        return_proba = self.model.predict_proba(product_data)[:, 1]
        return_prediction = self.model.predict(product_data)
        
        return return_prediction, return_proba
    
    def save_model(self, filepath='models/return_model.pkl'):
        """Save the trained model"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'numerical_features': self.numerical_features,
                'categorical_features': self.categorical_features
            }, f)
        
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='models/return_model.pkl'):
        """Load a trained model"""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
            
        self.model = data['model']
        self.numerical_features = data['numerical_features']
        self.categorical_features = data['categorical_features']
        
        print(f"Model loaded from {filepath}")
    
    def predict_from_csv(self, input_csv, output_csv):
        """Predict return likelihood for products in CSV and save results"""
        print(f"\n=== Predicting returns from {input_csv} ===")
        
        # Load data
        df = pd.read_csv(input_csv)
        
        # Make predictions
        return_pred, return_proba = self.predict(df)
        
        # Add predictions to dataframe
        df['predicted_return'] = return_pred
        df['return_probability'] = return_proba
        
        # Save results
        df.to_csv(output_csv, index=False)
        print(f"Predictions saved to {output_csv}")
        
        return df


if __name__ == "__main__":
    # This section will be used for testing
    print("Product Return Prediction Model Module")
    print("Use this module to train and predict product returns")
