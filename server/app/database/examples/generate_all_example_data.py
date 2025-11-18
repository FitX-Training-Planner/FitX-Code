from datetime import date, timedelta
import random
from .generate_example_data import insert_client_muscle_groups_example, insert_complaint_example, insert_complaint_likes_example, insert_full_contract_example, insert_full_training_plan_example, insert_payment_plan_example, insert_rating_example, insert_rating_likes_example, insert_trainer_saves_example, insert_trainer_specialties_example, insert_trainer_user_example, insert_user_example
from ...config import ExamplesData
from ..context_manager import get_db

def insert_client_examples(db):
    error_message = "Erro ao criar clientes de exemplo"

    try:
        client_examples = [
            {
                "name": "Paulo Henrique",
                "email": ExamplesData.EXAMPLE_FIRST_CLIENT_EMAIL,
                "muscle_group_ids": [1, 3, 8]
            },
            {
                "name": "Barbosa",
                "email": ExamplesData.EXAMPLE_SECOND_CLIENT_EMAIL,
                "muscle_group_ids": [2, 3, 4]
            },
            {
                "name": "Miguel Campos",
                "email": ExamplesData.EXAMPLE_THIRD_CLIENT_EMAIL,
                "muscle_group_ids": [3, 8, 10, 11]
            },
            {
                "name": "Letícia Brandão",
                "email": ExamplesData.EXAMPLE_FOURTH_CLIENT_EMAIL,
                "muscle_group_ids": [1]
            },
            {
                "name": "Rodrigo Mariano",
                "email": ExamplesData.EXAMPLE_FIFTH_CLIENT_EMAIL,
                "muscle_group_ids": []
            },
            {
                "name": "Johnata Santicioli",
                "email": ExamplesData.EXAMPLE_SIXTH_CLIENT_EMAIL,
                "muscle_group_ids": [1, 2, 3, 6, 7, 8]
            }
        ]

        client_ids = []

        for client_example in client_examples:
            client = insert_user_example(db, client_example["name"], client_example["email"], ExamplesData.EXAMPLE_DEFAULT_PASSWORD, True)

            insert_client_muscle_groups_example(db, client.ID, client_example["muscle_group_ids"])

            client_ids.append(client.ID)

        return client_ids

    except Exception as e:
        db.rollback()

        print(f"{error_message}: {e}")

def insert_trainer_examples(db):
    error_message = "Erro ao criar treinadores de exemplo"

    try:
        trainer_examples = [
            {
                "name": "Pereira Paulo",
                "email": ExamplesData.EXAMPLE_FIRST_TRAINER_EMAIL,
                "specialty_ids": [1, 5, 9]
            },
            {
                "name": "Leonardo Motta",
                "email": ExamplesData.EXAMPLE_SECOND_TRAINER_EMAIL,
                "specialty_ids": [10]
            },
            {
                "name": "Trô Armen",
                "email": ExamplesData.EXAMPLE_THIRD_TRAINER_EMAIL,
                "specialty_ids": [6, 7, 8]
            }
        ]

        trainers = []

        for trainer_example in trainer_examples:
            trainer = insert_trainer_user_example(db, trainer_example["name"], trainer_example["email"], ExamplesData.EXAMPLE_DEFAULT_PASSWORD)

            insert_trainer_specialties_example(db, trainer.ID, trainer_example["specialty_ids"])

            insert_full_training_plan_example(db, trainer.ID, "ABC / Upper Lower")

            payment_plan_examples = [
                {
                    "name": "Barato",
                    "full_price": 100.00,
                    "duration_days": 30
                },
                {
                    "name": "Acessível",
                    "full_price": 250.00,
                    "duration_days": 60
                },
                {
                    "name": "Plus",
                    "full_price": 400.00,
                    "duration_days": 90
                }
            ]

            for payment_plan_example in payment_plan_examples:
                payment_plan = insert_payment_plan_example(db, trainer.ID, payment_plan_example["name"], payment_plan_example["full_price"], payment_plan_example["duration_days"])

                trainer.payment_plans.append(payment_plan)

            trainers.append(trainer)

        return trainers

    except Exception as e:
        db.rollback()

        print(f"{error_message}: {e}")

def insert_rating_examples(db, user_ids, trainer_ids):
    error_message = "Erro ao criar avaliações de exemplo"

    try:
        rating_ids = []

        for user_id in user_ids:
            for trainer_id in trainer_ids:
                rating = insert_rating_example(db, user_id, trainer_id, random.randint(1, 5))

                insert_rating_likes_example(db, user_ids, rating.ID)

                rating_ids.append(rating.ID)

        return rating_ids

    except Exception as e:
        db.rollback()

        print(f"{error_message}: {e}")

def insert_complaint_examples(db, user_ids, trainer_ids):
    error_message = "Erro ao criar denúncias de exemplo"

    try:
        complaint_ids = []

        for user_id in user_ids:
            for trainer_id in trainer_ids:
                complaint = insert_complaint_example(db, user_id, trainer_id)

                insert_complaint_likes_example(db, user_ids, complaint.ID)

                complaint_ids.append(complaint.ID)

        return complaint_ids

    except Exception as e:
        db.rollback()

        print(f"{error_message}: {e}")

def insert_trainer_saves_examples(db, user_ids, trainer_ids):
    error_message = "Erro ao criar salvamentos dos treinadores de exemplo"

    try:
        for trainer_id in trainer_ids:
            insert_trainer_saves_example(db, user_ids, trainer_id)

        return True

    except Exception as e:
        db.rollback()

        print(f"{error_message}: {e}")

def insert_contract_examples(db, user_ids, trainers):
    error_message = "Erro ao criar contratos de exemplo"

    try:
        contract_ids = []
        active_contracts_per_trainer = 1
        expired_contracts_per_trainer = 20
        canceled_contracts_per_trainer = 2

        for trainer in trainers:
            for number in range(min(active_contracts_per_trainer, len(user_ids))):
                payment_plan = random.choice(trainer.payment_plans)

                contract = insert_full_contract_example(db, user_ids[number], trainer.ID, payment_plan.ID, float(payment_plan.full_price), payment_plan.duration_days, date.today() - timedelta(days=1))

                contract_ids.append(contract.ID)
            
            for number in range(1, expired_contracts_per_trainer + 1):
                payment_plan = random.choice(trainer.payment_plans)

                contract = insert_full_contract_example(db, random.choice(user_ids), trainer.ID, payment_plan.ID, float(payment_plan.full_price), payment_plan.duration_days, date.today() - timedelta(days=1 + (number * payment_plan.duration_days)), 2)

                contract_ids.append(contract.ID)
            
            for number in range(1, canceled_contracts_per_trainer + 1):
                payment_plan = random.choice(trainer.payment_plans)

                contract = insert_full_contract_example(db, random.choice(user_ids), trainer.ID, payment_plan.ID, float(payment_plan.full_price), payment_plan.duration_days, date.today() - timedelta(days=(1 + (number * payment_plan.duration_days) ) * 1.5), 3)

                contract_ids.append(contract.ID)

        return contract_ids

    except Exception as e:
        db.rollback()

        print(f"{error_message}: {e}")

def generate_all_example_data():
    error_message = "Erro ao criar todos os dados de exemplo"

    with get_db() as db:
        try:
            client_ids = insert_client_examples(db)
            trainers = insert_trainer_examples(db)

            trainer_ids = [trainer.ID for trainer in trainers]

            insert_rating_examples(db, client_ids, trainer_ids)
            insert_complaint_examples(db, client_ids, trainer_ids)
            insert_trainer_saves_examples(db, client_ids, trainer_ids)
            insert_contract_examples(db, client_ids, trainers)

            db.commit()

            return True

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")