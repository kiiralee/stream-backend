import { useEffect, useRef } from 'react';
import { Alert, Loader, Stack } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { ROUTES } from '@/shared/config/routes';
import { notify } from '@/shared/lib/notify';
import type { UserModel, VerificationInput } from '@/shared/types/api';

export function VerifyAccount() {
  const [sp] = useSearchParams();
  const token = sp.get('token');
  const navigate = useNavigate();
  const qc = useQueryClient();
  const triggered = useRef(false);

  const mut = useMutation({
    mutationFn: (data: VerificationInput) =>
      gqlRequest<{ verifyAccount: UserModel }, { data: VerificationInput }>(
        ops.MUT_VERIFY_ACCOUNT,
        { data },
      ),
    onSuccess: async () => {
      // Backend set the session cookie on the verify response. The verifyAccount
      // payload doesn't carry the full profile (no stream / socialLinks / settings),
      // so seed the cache by issuing a real findProfile request — that also confirms
      // the cookie made it back to the browser before we navigate.
      try {
        const data = await gqlRequest<{ findProfile: UserModel }>(ops.QUERY_PROFILE);
        qc.setQueryData(QK.profile, data.findProfile);
      } catch {
        // Fall back to passive invalidation; next consumer will refetch.
        await qc.invalidateQueries({ queryKey: QK.profile });
      }
      notify.success('Email verified — welcome aboard!');
      navigate(ROUTES.home);
    },
    onError: (err: Error) => notify.error(err.message, 'Verification failed'),
  });

  useEffect(() => {
    if (!token || triggered.current) return;
    triggered.current = true;
    mut.mutate({ token });
  }, [token, mut]);

  if (!token) {
    return <Alert color="red">Missing verification token in URL.</Alert>;
  }
  if (mut.isPending) {
    return (
      <Stack align="center" py="xl">
        <Loader />
      </Stack>
    );
  }
  if (mut.isError) {
    return <Alert color="red">{mut.error.message}</Alert>;
  }
  return null;
}
