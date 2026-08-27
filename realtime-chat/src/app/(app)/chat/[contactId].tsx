import { Redirect, useLocalSearchParams } from 'expo-router';
import { ChatScreen } from '../../../screens/ChatScreen';

export default function ChatRoute() {
    const { contactId } = useLocalSearchParams<{ contactId: string }>();

    if (!contactId) {
        return <Redirect href="/users" />;
    }

    return <ChatScreen contactId={contactId} />;
}
