
'use client';

import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import type { CalculateExpiryDateOutput } from '@/ai/flows/calculate-expiry-date';

type ExpiryAlertHandlerProps = {
  result: CalculateExpiryDateOutput;
};

export default function ExpiryAlertHandler({ result }: ExpiryAlertHandlerProps) {
  const hasAlerted = useRef(false);

  useEffect(() => {
    if (!result || hasAlerted.current) {
      return;
    }

    const isExpired = result.status.toLowerCase().includes('expired');

    if (!isExpired) {
      return;
    }

    const playSound = async () => {
      try {
        await Tone.start();
        const synth = new Tone.Synth().toDestination();
        const now = Tone.now();
        synth.triggerAttackRelease('C5', '8n', now);
        synth.triggerAttackRelease('C5', '8n', now + 0.2);
        synth.triggerAttackRelease('C5', '8n', now + 0.4);
      } catch (error) {
        console.error('Could not play warning sound:', error);
      }
    };

    playSound();
    hasAlerted.current = true; // Ensure this runs only once per result

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return null; // This component does not render anything
}
