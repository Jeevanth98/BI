"""
Customer Churn Prediction Model using XGBoost
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import xgboost as xgb
import pickle
import os


class ChurnPredictor:
    def __init__(self):
        """Initialize the churn prediction model"""
        self.model = None
        self.feature_columns = [
            'frequency',
            'monetary',
            'avg_review_score',
            'avg_delivery_time',
            'avg_delivery_lateness',
            'avg_approval_hours',
            'number_of_low_reviews',
            'has_left_bad_review',
            'avg_days_between_purchases',
            'std_dev_days_between_purchases',
            'frequency_last_90_days',
            'monetary_last_90_days',
            'freq_ratio_90d_alltime'
        ]
        self.AT_RISK_LOWER_BOUND = 90
        self.AT_RISK_UPPER_BOUND = 180
        self.CHURN_THRESHOLD_DAYS = 180
        self.PREDICTION_WINDOW_DAYS = 30
        
    def prepare_training_data(self, customer_master_df):
        """Prepare at-risk customer data for training"""
        print("\n=== Preparing Churn Training Data ===")
        
        # Identify at-risk customers
        at_risk_df = customer_master_df[
            (customer_master_df['recency'] > self.AT_RISK_LOWER_BOUND) &
            (customer_master_df['recency'] <= self.AT_RISK_UPPER_BOUND)
        ].copy()
        
        # Create target variable (will they churn in next 30 days?)
        at_risk_df['will_churn_in_30_days'] = (
            at_risk_df['recency'] > (self.CHURN_THRESHOLD_DAYS - self.PREDICTION_WINDOW_DAYS)
        ).astype(int)
        
        print(f"At-risk customers: {len(at_risk_df)}")
        print(f"Churn distribution:\n{at_risk_df['will_churn_in_30_days'].value_counts()}")
        
        return at_risk_df
    
    def train(self, customer_master_df):
        """Train the XGBoost churn prediction model"""
        print("\n=== Training Churn Prediction Model ===")
        
        # Prepare data
        at_risk_df = self.prepare_training_data(customer_master_df)
        
        # Features and target
        X = at_risk_df[self.feature_columns].copy()
        y = at_risk_df['will_churn_in_30_days']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Handle class imbalance
        scale_pos_weight = y_train.value_counts()[0] / y_train.value_counts()[1]
        
        # Create pipeline with scaling and XGBoost
        self.model = Pipeline(steps=[
            ('scaler', StandardScaler()),
            ('classifier', xgb.XGBClassifier(
                n_estimators=300,
                max_depth=3,
                learning_rate=0.1,
                subsample=0.7,
                colsample_bytree=1.0,
                scale_pos_weight=scale_pos_weight,
                random_state=42,
                use_label_encoder=False,
                eval_metric='logloss'
            ))
        ])
        
        # Train model
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        print(f"Training accuracy: {train_score:.4f}")
        print(f"Testing accuracy: {test_score:.4f}")
        
        return self.model
    
    def predict(self, customer_data):
        """Predict churn probability for customers"""
        if self.model is None:
            raise ValueError("Model not trained yet. Call train() first.")
        
        # Ensure input is a DataFrame
        if isinstance(customer_data, pd.Series):
            customer_data = customer_data.to_frame().T
        
        # Select features
        X = customer_data[self.feature_columns].copy()
        
        # Predict probability
        churn_proba = self.model.predict_proba(X)[:, 1]
        churn_prediction = self.model.predict(X)
        
        return churn_prediction, churn_proba
    
    def save_model(self, filepath='models/churn_model.pkl'):
        """Save the trained model"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'feature_columns': self.feature_columns,
                'AT_RISK_LOWER_BOUND': self.AT_RISK_LOWER_BOUND,
                'AT_RISK_UPPER_BOUND': self.AT_RISK_UPPER_BOUND
            }, f)
        
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='models/churn_model.pkl'):
        """Load a trained model"""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
            
        self.model = data['model']
        self.feature_columns = data['feature_columns']
        self.AT_RISK_LOWER_BOUND = data.get('AT_RISK_LOWER_BOUND', 90)
        self.AT_RISK_UPPER_BOUND = data.get('AT_RISK_UPPER_BOUND', 180)
        
        print(f"Model loaded from {filepath}")
    
    def predict_from_csv(self, input_csv, output_csv):
        """Predict churn for data in CSV and save results"""
        print(f"\n=== Predicting churn from {input_csv} ===")
        
        # Load data
        df = pd.read_csv(input_csv)
        
        # Make predictions
        churn_pred, churn_proba = self.predict(df)
        
        # Add predictions to dataframe
        df['predicted_churn'] = churn_pred
        df['churn_probability'] = churn_proba
        
        # Save results
        df.to_csv(output_csv, index=False)
        print(f"Predictions saved to {output_csv}")
        
        return df


if __name__ == "__main__":
    # This section will be used for testing
    print("Churn Prediction Model Module")
    print("Use this module to train and predict customer churn")
