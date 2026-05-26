import { Alert, Anchor, Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { IconMailCheck } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { ROUTES } from '@/shared/config/routes';
import { notify } from '@/shared/lib/notify';
import type { CreateUserInput } from '@/shared/types/api';

const schema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 chars')
    .regex(/^[a-z0-9_]+$/, 'Lowercase, digits and underscore only'),
  email: z.string().email(),
  password: z.string().min(8, 'At least 8 chars'),
});

type Values = z.infer<typeof schema>;

interface MutData {
  createUser: boolean;
}

export function RegisterForm() {
  const form = useForm<Values>({
    initialValues: { username: '', email: '', password: '' },
    validate: zodResolver(schema),
  });

  const mut = useMutation({
    mutationFn: (data: CreateUserInput) =>
      gqlRequest<MutData, { data: CreateUserInput }>(ops.MUT_CREATE_USER, { data }),
    onError: (err: Error) => notify.error(err.message, 'Registration failed'),
  });

  // After success we swap the form for a "check your inbox" panel. `mut.variables`
  // is set by TanStack Query right before the mutation runs, so the email is available
  // here regardless of what the resolver returns.
  if (mut.isSuccess) {
    const sentTo = mut.variables?.email;
    return (
      <Stack>
        <Alert
          icon={<IconMailCheck size={18} />}
          color="teal"
          variant="light"
          title="Check your inbox"
        >
          <Text size="sm">
            We&apos;ve sent a verification link
            {sentTo ? (
              <>
                {' '}to <Text span fw={600}>{sentTo}</Text>
              </>
            ) : null}
            . Open it on this device to finish setting up your account.
          </Text>
        </Alert>
        <Text c="dimmed" size="sm">
          Didn&apos;t get the email? Check your spam folder, or{' '}
          <Anchor component="button" type="button" onClick={() => mut.reset()}>
            try a different address
          </Anchor>
          .
        </Text>
        <Text c="dimmed" size="sm">
          Already verified?{' '}
          <Anchor component={Link} to={ROUTES.login}>
            Sign in
          </Anchor>
        </Text>
      </Stack>
    );
  }

  return (
    <form onSubmit={form.onSubmit((v) => mut.mutate(v))}>
      <Stack>
        <TextInput label="Username" placeholder="creator" {...form.getInputProps('username')} />
        <TextInput label="Email" type="email" {...form.getInputProps('email')} />
        <PasswordInput label="Password" {...form.getInputProps('password')} />
        <Button type="submit" loading={mut.isPending}>
          Create account
        </Button>
        <Text c="dimmed" size="sm">
          Already have an account?{' '}
          <Anchor component={Link} to={ROUTES.login}>
            Sign in
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}
