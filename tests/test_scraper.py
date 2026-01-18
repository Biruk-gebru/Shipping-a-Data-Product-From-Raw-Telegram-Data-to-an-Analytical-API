import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from src.scraper import TelegramScraper

@pytest.mark.asyncio
async def test_scrape_channel():
    # Mock credentials
    api_id = "12345"
    api_hash = "abcdef"
    phone = "+123456789"
    
    # Mock Telethon client
    with patch('src.scraper.TelegramClient') as MockClient:
        mock_client_instance = MockClient.return_value
        # Ensure connect/start methods are AsyncMock if awaited
        mock_client_instance.start = AsyncMock()
        mock_client_instance.download_media = AsyncMock()
        mock_client_instance.get_entity = AsyncMock()
        
        # Mock get_entity
        mock_entity = MagicMock()
        mock_entity.username = "test_channel"
        mock_entity.id = 123
        mock_client_instance.get_entity.return_value = mock_entity
        
        # Mock iter_messages
        mock_message = MagicMock()
        mock_message.id = 1
        # Mocking date.isoformat()
        mock_date = MagicMock()
        mock_date.isoformat.return_value = "2023-01-01T00:00:00"
        mock_message.date = mock_date
        
        mock_message.text = "Hello World"
        mock_message.views = 100
        mock_message.forwards = 10
        mock_message.media = None
        
        # Async iterator mock
        async def async_iter(*args, **kwargs):
            yield mock_message
            
        mock_client_instance.iter_messages.side_effect = async_iter
        
        scraper = TelegramScraper(api_id, api_hash, phone)
        # Manually set client to our mock instance
        scraper.client = mock_client_instance
        
        # We need to patch os.makedirs and json.dump to avoid file system usage
        with patch('os.makedirs') as mock_makedirs, \
             patch('json.dump') as mock_json_dump, \
             patch('builtins.open', new_callable=MagicMock):
            
            await scraper.scrape_channel("https://t.me/test_channel")
            
            # Verify get_entity called
            mock_client_instance.get_entity.assert_called_with("https://t.me/test_channel")
            
            # Verify json dump called
            assert mock_json_dump.called
            args, _ = mock_json_dump.call_args
            data = args[0]
            assert len(data) == 1
            assert data[0]['message_text'] == "Hello World"
            assert data[0]['channel_name'] == "test_channel"
