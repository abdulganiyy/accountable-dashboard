import { gql } from "@apollo/client";

export const GET_USER = gql`
  query User {
    user {
      ... on ResponseWithUser {
        data {
          id
          firstName
          lastName
          email
          role
          phone
          onboarded
          emailVerified
          phoneVerified
          createdAt
          updatedAt
          google
        }
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const DASHBOARD = gql`
query Dashboard($input: DashboardFilter!) {
  dashboard(input: $input) {
    ... on ResponseWithDashboard {
      data {
        meeting {
          attendees {
            displayName
            email
            organizer
            responseStatus
            self
          }
          created
          description
          end {
            dateTime
            timeZone
          }
          hangoutLink
          id
          htmlLink
          start {
            dateTime
            timeZone
          }
          status
          summary
          updated
        }
        overview {
          customerMessages
          filesRequested
          scheduledMeetings
        }
        report {
          comment {
            date
            sender {
              email
              firstName
              lastName
            }
            text
          }
          createdAt
          dueDate
          files {
            name
            url
          }
          history {
            dueDate
            files {
              name
              url
            }
            name
            sender
            recipient
            status
            type
          }
          id
          name
          recipient {
            email
            firstName
            lastName
          }
          sender {
            email
            firstName
            lastName
          }
          status
          type
          updatedAt
        }
      }
      message
    }
    ... on Error {
      code
      message
    }
  }
}
`

export const MANAGERS = gql`
query Managers($input: ManagerFilter!) {
  managers(input: $input) {
    ... on ResponseWithUsers {
      data {
        email
        firstName
        lastName
        role
        onboarded
        phone
        phoneVerified
        updatedAt
        appointment
        createdAt
        emailVerified
        id
        lastActive
      }
      pagination {
        limit
        page
        pages
      }
    }
    ... on Error {
      message
      code
    }
  }
}
`

export const MANAGER = gql`
query Manager($input: GetManagerInput!) {
  manager(input: $input) {
    ... on ResponseWithUser {
      data {
        appointment
        createdAt
        email
        emailVerified
        firstName
        id
        lastName
        onboarded
        phone
        phoneVerified
        role
        updatedAt
      }
    }
    ... on Error {
      code
      message
    }
  }
}
`

export const CUSTOMERS = gql`
query Customers($input: CustomerFilter!) {
  customers(input: $input) {
    ... on ResponseWithUsers {
      data {
        appointment
        createdAt
        email
        emailVerified
        firstName
        id
        manager {
          firstName
        }
        lastName
        onboarded
        phone
        phoneVerified
        role
        updatedAt
      }
      pagination {
        limit
        page
        pages
      }
    }
    ... on Error {
      code
      message
    }
  }
}
`

export const CUSTOMER = gql`
query Customer($input: GetCustomerInput!) {
  customer(input: $input) {
    ... on ResponseWithUser {
      data {
        appointment
        createdAt
        email
        emailVerified
        firstName
        id
        lastName
        manager{
          email
          firstName
          lastName
        }
        onboarded
        spreadsheet
        phone
        phoneVerified
        role
        updatedAt
      }
    }
    ... on Error {
      code
      message
    }
  }
}
`

export const SERVICES = gql`query GetServices($input: ServiceFilter!) {
  getServices(input: $input) {
    ... on ResponseWithServices {
      data {
        currency
        description
        frequency
        history {
          author
          date
          description
        }
        id
        name
        price
        subscribers
        subscription
      }
      pagination {
        page
        limit
        pages
      }
    }
    ... on Error {
      code
      message
    }
  }
}`

export const SERVICE = gql`
query GetService($input: GetServiceInput!) {
  getService(input: $input) {
    ... on ResponseWithService {
      data {
        author {
          email
          firstName
          lastName
        }
        currency
        description
        frequency
        history {
          author
          date
          description
        }
        id
        name
        price
        subscription
        subscribers
      }
    }
  }
}
`

export const SUBSCRIPTIONS = gql`query GetSubscriptions($input: SubscriptionFilter!) {
  getSubscriptions(input: $input) {
    ... on ResponseWithSubscriptions {
      data {
        active
        pending
        plan
        recurring
        service {
          id
          name
        }
        frequency
        expiredAt
        expired
        duration
        id
        updatedAt
        activeAt
        createdAt
        initiator {
          email
          firstName
          lastName
        }
        invoice {
          amount
          cancelled
          checksum
          createdAt
          currency
        }
      }
      pagination {
        limit
        page
        pages
      }
    }
  }
}`

export const GET_AUTH_URL = gql`query GetAuthUrl {
  getAuthUrl {
    ... on ResponseWithUrl {
      data
    }
    ... on Error {
      code
      message
    }
  }
}`

export const GET_BANKS = gql`
  query AccountLinkingBanks($input: Page) {
    accountLinkingBanks(input: $input) {
      ... on ResponseWithAccountLinkingBanks {
        data {
          results {
            id
            integrator
            corporate
            individual
            code
            name
            icon
          }
          count
          next
          previous
        }
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const GET_ACCOUNT_MANAGER = gql`query GetCalendar($input: Date!) {
  getCalendar(input: $input) {
    data {
      attendees {
        displayName
        email
        organizer
        responseStatus
        self
      }
      authored
      created
      description
      end {
        dateTime
        timeZone
      }
      hangoutLink
      htmlLink
      id
      start {
        dateTime
        timeZone
      }
      status
      summary
      updated
    }
    message
  }
}`

export const LIST_TRIAL_BALANCE = gql`
  query ListTrialBalance($input: Page) {
    listTrialBalance(input: $input) {
      ... on ResponseWithListTrialBalance {
        data {
          results {
            currency
            id
            date
            data {
              all_account_total_credit
              all_account_total_debit
              currency
              accounts {
                account
                account_types {
                  account_name
                  account_type
                  credit
                  debit
                }
                total_credit
                total_debit
              }
            }
            name
            user
          }
        }
        message
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const TRIAL_BALANCE_BREAKDOWN = gql`
  query TrialBalanceAccountBreakdown($input: TrialBalanceAccountBreakdown!) {
    trialBalanceAccountBreakdown(input: $input) {
      ... on ResponseWithTrialBalanceAccountBreakdown {
        data {
          account {
            account_element
            account_type
            code
            id
            name
            user
          }
          amount
          currency
          date
          description
          id
        }
      }
      ... on Error {
        code
      }
    }
  }
`;

export const TRIAL_BALANCE_DETAILS = gql`
  query TrialBalanceDetails($input: OneTrialBalance!) {
    trialBalanceDetails(input: $input) {
      ... on Error {
        code
      }
      ... on ResponseWithTrialBalanceDetails {
        data
      }
    }
  }
`;

export const FINANCIAL_SUMMARY = gql`
  query FinancialSummary {
    financialSummary {
      ... on ResponseWithFinancialSummary {
        data {
          all_assets
          all_cash_and_assets
          cash_in_bank
          expenditure
          liabilities
          revenue
          runway_duration
        }
        message
      }
      ... on Error {
        code
      }
    }
  }
`;

export const LIST_STATEMENTS = gql`
  query ListFinancialStatement($input: Page) {
    listFinancialStatement(input: $input) {
      ... on ResponseWithListFinancialStatement {
        data {
          results
          previous
          count
          next
        }
      }
      ... on Error {
        code
      }
    }
  }
`;

export const GET_REPORT_SUMMARY = gql`
  query GetReportSummary {
    getReportSummary {
      ... on ResponseWithSummary {
        data {
          prepared
          requested
          uploaded
        }
      }
      ... on Error {
        code
      }
    }
  }
`;

export const GET_REPORTS_AND_FILES = gql`
  query GetReportsAndFiles($input: ReportFilter) {
    getReportsAndFiles(input: $input) {
      ... on ResponseWithReports {
        data {
          id
          name
          recipient {
            id
            email
          }
          history {
            name
          }
          createdAt
          dueDate
          files {
            name
            url
          }
          sender {
            id
            email
          }
          status
          type
          updatedAt
        }
        pagination {
          limit
          page
          pages
        }
      }
      ... on Error {
        code
      }
    }
  }
`;

export const RETRIEVE_FEED = gql`
  query RetrieveActivityFeed($input: Page) {
    retrieveActivityFeed(input: $input) {
      ... on ResponseWithReports {
        data {
          comment {
            sender {
              email
            }
            date
            text
          }
          dueDate
          createdAt
          files {
            name
            url
          }
          history {
            dueDate
            files {
              name
              url
            }
            name
            status
            type
            sender
            recipient
          }
          id
          name
          recipient {
            email
            lastName
          }
          sender {
            email
            lastName
          }
          status
          type
          updatedAt
        }
      }
    }
  }
`;

export const GET_REPORT = gql`
  query GetReport($input: GetReportInput) {
    getReport(input: $input) {
      ... on ResponseWithReport {
        data {
          comment {
            date
            sender {
              email
              firstName
            }
            text
          }
          createdAt
          dueDate
          files {
            name
            url
          }
          history {
            dueDate
            files {
              url
              name
            }
            name
            recipient
            sender
            status
            type
          }
          id
          name
          recipient {
            email
            lastName
          }
          sender {
            email
            firstName
          }
          status
          type
          updatedAt
        }
      }
      ... on Error {
        code
        message
      }
    }
  }
`;

export const CARDS = gql`
  query Cards {
    cards {
      ... on ResponseWithCards {
        data {
          country
          createdAt
          first6digits
          last4digits
          owner {
            email
            firstName
          }
          type
          updatedAt
          issuer
          id
          expiry
        }
      }
      ... on Error {
        message
        code
      }
    }
  }
`;

export const VERIFY_TRANSACTIONS = gql`query VerifyTx($input: VerifyTx!) {
  verifyTx(input: $input) {
    ... on Response {
      message
    }
    ... on Error {
      code
    }
  }
}`

export const GET_SUBSCRIPTIONS = gql`
query GetSuscriptions($input: SubscriptionFilter!) {
  getSuscriptions(input: $input) {
    ... on ResponseWithSubscriptions {
      message
      pagination {
        limit
      }
      data {
        active
        activeAt
        createdAt
        duration
        expired
        expiredAt
        frequency
        id
        plan
        recurring
        updatedAt
        service {
          name
          description
        }
      }
    }
    ... on Error {
      code
      message
    }
  }
}
`

export const CONVERSATIONS= gql`query Conversations($input: Page) {
  conversations(input: $input) {
    ... on ResponseWithConversations {
      data {
        createdAt
        id
        unread
        updatedAt
        participants {
          email
          lastName
          firstName
          avatar
        }
        lastMessage {
          text
        }
      }
    }
    ... on Error {
      code
      message
    }
  }
}`

export const MESSAGES = gql`query Conversation($input: ConversationInput!) {
  conversation(input: $input) {
    ... on ResponseWithMessages {
      data {
        sender {
          email
          firstName
          id
          lastName
        }
        recipient {
          email
          id
          lastName
          firstName
        }
        read
        createdAt
        attachment {
          name
          url
        }
        text
        updatedAt
      }
    }
  }
}`

export const REFERRALS = gql`
query Referrals($input: ReferralFilter!) {
  referrals(input: $input) {
    ... on ResponseWithReferrals {
      data {
        
        code
        createdAt
        email
        name
        history {
          author
          date
          description
        }
        note
        referee {
          email
          firstName
        }
        referrer {
          email
          firstName
          lastName
        }
        status
        updatedAt
        id
      }
      pagination {
        limit
        page
        pages
      }
    }
    ... on Error {
      code
      message
    }
  }
}
`

export const REFERRAL_SUMMARY = gql`
query ReferralSummary($input: Date) {
  referralSummary(input: $input) {
    ... on ResponseWithReferralSummary {
      data {
        activeInvites
        earnedGifts
        totalInvites
      }
    }
    ... on Error {
      message
      code
    }
  }
}
`