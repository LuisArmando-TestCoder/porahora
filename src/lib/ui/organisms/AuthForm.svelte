<script lang="ts">
  import { onMount } from 'svelte';
  import { z } from 'zod';
  import { runtime } from '$lib/config/runtime';
  import { loginWithGoogle, loginWithEmail, signupWithGoogle, signupWithEmail } from '$lib/api/auth';
  import EmailInput from '$lib/ui/components/EmailInput.svelte';

  export let mode: 'login' | 'signup' = 'login';
  export let copy: any; // from auth.json (login or signup branch)
  export let legal: { termsUrl: string; privacyUrl: string } = { termsUrl: '/legal/terms', privacyUrl: '/legal/privacy' };

  const emailSchema = z.string().email();
  let email = '';
  let errorMsg = '';
  let loading = false;

  onMount(() => {
    console.info('[auth-form] mount', { mode, mock: runtime.isMockMode });
  });

  async function onGoogle() {
    loading = true; errorMsg = '';
    const res = mode === 'login' ? await loginWithGoogle() : await signupWithGoogle();
    loading = false;
    if (!res.ok) { errorMsg = res.error; return; }
    // In real Google flow we redirected; in mock we proceed
    if (runtime.isMockMode) window.location.href = '/dashboard';
  }

  async function onEmail() {
    loading = true; errorMsg = '';
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { errorMsg = 'Please enter a valid email.'; loading = false; return; }
    const res = mode === 'login' ? await loginWithEmail(parsed.data) : await signupWithEmail(parsed.data);
    loading = false;
    if (!res.ok) { errorMsg = res.error; return; }
    if (runtime.isMockMode) window.location.href = '/dashboard';
  }
</script>

<div class="auth-form">
  <div class="auth-form__card">
    <div class="auth-form__header">
      <img src="/icons/logo.png" width="175" alt="logo" class="auth-form__logo" />
      <h1 class="auth-form__title">{copy.title}</h1>
    </div>
    {#if copy.subtitle}
      <p class="auth-form__subtitle">{copy.subtitle}</p>
    {/if}
  
    <!-- Google -->
    <button on:click|preventDefault={onGoogle} class="auth-form__button auth-form__button--google">
      <svg aria-hidden="true" viewBox="0 0 24 24" class="auth-form__icon"><path fill="currentColor" d="M21.35 11.1h-9.18v2.96h5.27c-.23 1.46-1.59 4.29-5.27 4.29-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.02.77 3.72 1.43l2.53-2.44C16.6 3.83 14.49 3 12.17 3 6.97 3 2.75 7.22 2.75 12.5S6.97 22 12.17 22c7.08 0 8.78-6.1 8.78-9.27 0-.63-.07-1.03-.17-1.63Z"/></svg>
      <span>{copy.google}</span>
    </button>
  
    <!-- Divider -->
    <div class="auth-form__divider">
      <span class="auth-form__divider-line"></span>
      <span>{copy.or}</span>
      <span class="auth-form__divider-line"></span>
    </div>
  
  <!-- Email input -->
  <EmailInput bind:value={email} placeholder={copy.emailPlaceholder} label="Email" onEnter={() => onEmail()} />
  
    <button on:click|preventDefault={onEmail} class="auth-form__button auth-form__button--primary">
      {copy.continueWithEmail}
    </button>
  
    {#if errorMsg}
      <p class="auth-form__error">{errorMsg}</p>
    {/if}
  
    <!-- Switch link -->
    <p class="auth-form__switch">
      {copy.switchText}
      <a href={copy.switchHref} class="auth-form__switch-link">{copy.switchLink}</a>
    </p>
  
    <!-- Legal -->
    <p class="auth-form__legal">
      By proceeding, you are agreeing to {runtime.appName}'s
      <a href={legal.termsUrl} class="auth-form__legal-link">Terms of Service</a> and
      <a href={legal.privacyUrl} class="auth-form__legal-link">Privacy Policy</a>.
    </p>
  </div>
</div>

<style lang="scss">
  @use '../../../styles/global.scss';

  .auth-form {
    padding: var(--space-xl) 0;
    height: 100vh;
    display: grid;
    place-items: center;

    &__card {
      background: var(--c-white);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      box-shadow: var(--shadow-md);
      transition: transform var(--transition-normal), box-shadow var(--transition-normal);
      max-width: 440px;
      margin: 0 auto;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }
    }

    &__header {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      place-items: center start;
      grid-gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    &__logo {
      display: block;
    }

    &__title {
      margin: 0;
      line-height: 1.2;
      letter-spacing: -0.01em;
      color: var(--c-text);
      text-align: right;
    }

    &__subtitle {
      margin-bottom: var(--space-lg);
    }

    &__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      margin-bottom: var(--space-md);
      border: 0 solid #000;

      &--google {
        border: 1.5px solid var(--c-border);
        background: var(--c-bg);
        color: var(--c-text);

        &:hover {
          background: var(--c-bg-alt);
          color: var(--c-primary-dark);
          text-decoration: none;
        }
      }

      &--primary {
        background: var(--c-primary);
        color: var(--c-white);
        font-weight: 700;
        transition: .1s;

        &:hover {
          background: var(--c-primary-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          text-decoration: none;
          transform: scale(1.01);
        }
      }
    }

    &__icon {
      width: 20px;
      height: 20px;
      opacity: 0.9;
    }

    &__divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      margin: var(--space-lg) 0;
      color: var(--c-text-light);
      letter-spacing: 0.08em;
    }

    &__divider-line {
      height: 1px;
      background: var(--c-border);
      width: 100%;
      max-width: 120px;
    }

    &__label {
      color: var(--c-text);
      font-weight: 600;
      margin-bottom: var(--space-xs);
      display: block;
    }

    &__input {
      appearance: none;
      width: 100%;
      background: var(--c-bg);
      color: var(--c-text);
      border: 1.5px solid var(--c-border);
      border-radius: var(--radius-md);
      padding: 0.7rem 0.9rem;
      line-height: 1.4;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
      margin-bottom: var(--space-md);

      &::placeholder { color: var(--c-text-muted, #9aa3af); opacity: 0.9; }

      &:hover { border-color: var(--c-border-strong, #cbd5e1); }

      &:focus {
        border-color: var(--c-primary);
        outline: 0;
        box-shadow: 0 0 0 3px color-mix(in oklab, var(--c-primary) 20%, transparent);
        background: var(--c-white);
      }
    }

    &__error {
      margin: 0 0 var(--space-xs);
      font-weight: 600;
      animation: shake 280ms ease-in-out;
      color: red;
    }

    &__switch {
      color: var(--c-text-light);
      margin-top: var(--space-md);
    }

    &__switch-link {
      color: var(--c-primary);
      font-weight: 700;
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }

    &__legal {
      max-width: 440px;
      margin: var(--space-lg) auto 0;
      color: var(--c-text-light);
      line-height: 1.5;
    }

    &__legal-link {
      color: var(--c-primary);
      text-decoration: underline;
      &:hover { color: var(--c-primary-dark); }
    }
  }

  @keyframes shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-4px); }
    40%, 60% { transform: translateX(4px); }
  }
</style>
