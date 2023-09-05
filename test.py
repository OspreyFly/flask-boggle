from unittest import TestCase
from unittest.mock import patch
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        self.app = app.test_client()

    def test_boggle_route(self):
        response = self.app.get('/boggle')
        self.assertEqual(response.status_code, 200)
        # Add more assertions to check HTML content and session variables.

    @patch('app.Boggle')  # Mock the Boggle class
    def test_submit_route(self, mock_boggle):
        # Create a mock Boggle instance and set its behavior
        mock_instance = mock_boggle.return_value
        mock_instance.make_board.return_value = [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]
        mock_instance.words = {'ABC', 'DEF', 'GGG'}  # Set mock valid words

        # Test submitting a valid word
        valid_word_data = {'guess': 'ABC'}
        response = self.app.post('/submit', json=valid_word_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['result'], 'ok')

        # Test submitting an invalid word (not in dictionary)
        invalid_word_data = {'guess': 'ADG'}
        response = self.app.post('/submit', json=invalid_word_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['result'], 'not-a-word')

        # Test submitting a word not on the board
        invalid_board_data = {'guess': 'GGG'}
        response = self.app.post('/submit', json=invalid_board_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['result'], 'not-on-board')

if __name__ == '__main__':
    TestCase.main()

            

