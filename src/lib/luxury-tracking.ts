import { analytics } from './analytics'
import { supabase } from './supabase'

// High-Intent Tracking Events for Luxury Saunas
export const luxuryTracking = {
  // ========== CONFIGURATOR TRACKING ==========
  configuratorStarted: (model: string, basePrice: number) => {
    analytics.track('Configurator Started', {
      starting_model: model,
      starting_price: basePrice,
      intent_level: 'high'
    })
  },

  configuratorChanged: (option: string, value: string, priceImpact: number, totalPrice: number) => {
    analytics.track('Configurator Changed', {
      option,
      selected: value,
      price_impact: priceImpact,
      total_price: totalPrice,
      intent_level: 'high'
    })
  },

  configuratorCompleted: (config: any, finalPrice: number, timeSpent: number) => {
    analytics.track('Configurator Completed', {
      final_configuration: config,
      final_price: finalPrice,
      time_spent_seconds: timeSpent,
      intent_level: 'very_high',
      ready_to_buy: timeSpent > 300 // 5+ minutes = serious
    })
    
    // Update lead score
    updateLeadScore('configurator_completed', 30)
  },

  // ========== PRICING & FINANCING ==========
  pricingViewed: (model: string, price: number, scrollDepth: number, timeOnPage: number) => {
    analytics.track('Pricing Viewed', {
      model,
      base_price: price,
      scroll_depth_percent: scrollDepth,
      time_on_page_seconds: timeOnPage,
      intent_level: scrollDepth > 75 ? 'high' : 'medium'
    })
    
    if (scrollDepth > 75) {
      updateLeadScore('pricing_deep_view', 15)
    }
  },

  financingCalculatorUsed: (saunaPrice: number, downPayment: number, monthlyPayment: number, term: number) => {
    analytics.track('Financing Calculator Used', {
      sauna_price: saunaPrice,
      down_payment: downPayment,
      monthly_payment: monthlyPayment,
      term_months: term,
      intent_level: 'very_high'
    })
    
    updateLeadScore('financing_calculated', 25)
  },

  // ========== CONTENT ENGAGEMENT ==========
  videoEngagement: (title: string, duration: number, percentWatched: number, model?: string) => {
    analytics.track('Video Played', {
      video_title: title,
      duration_seconds: duration,
      percent_watched: percentWatched,
      model_featured: model,
      full_watch: percentWatched > 90,
      intent_level: percentWatched > 75 ? 'high' : 'medium'
    })
    
    if (percentWatched > 90) {
      updateLeadScore('video_full_watch', 10)
    }
  },

  galleryInteraction: (model: string, imagesViewed: number, zoomUsed: boolean, timeSpent: number) => {
    analytics.track('Gallery Viewed', {
      model,
      images_viewed: imagesViewed,
      zoom_used: zoomUsed,
      time_spent_seconds: timeSpent,
      deep_engagement: imagesViewed > 5 && timeSpent > 60
    })
  },

  documentDownloaded: (docType: 'spec_sheet' | 'brochure' | 'price_list' | 'installation_guide', model?: string) => {
    analytics.track('Document Downloaded', {
      document_type: docType,
      model,
      intent_level: 'high',
      sales_ready: docType === 'price_list'
    })
    
    const scores = {
      spec_sheet: 20,
      brochure: 15,
      price_list: 25,
      installation_guide: 20
    }
    updateLeadScore(`${docType}_downloaded`, scores[docType])
  },

  // ========== COMPARISON & RESEARCH ==========
  modelsCompared: (models: string[], comparisonType: string) => {
    analytics.track('Models Compared', {
      models,
      comparison_type: comparisonType,
      number_compared: models.length,
      intent_level: 'high'
    })
    
    updateLeadScore('comparison_made', 15)
  },

  competitorReturn: (competitor: string, timeAway: number, actionOnReturn: string) => {
    analytics.track('Returned from Competitor', {
      competitor,
      time_away_seconds: timeAway,
      action_on_return: actionOnReturn,
      chose_us: true
    })
  },

  // ========== DELIVERY & INSTALLATION ==========
  deliveryCalculated: (zipCode: string, cost: number, installationSelected: boolean) => {
    analytics.track('Delivery Calculated', {
      zip_code: zipCode.substring(0, 3) + 'XX', // Privacy
      delivery_cost: cost,
      installation_selected: installationSelected,
      intent_level: 'very_high'
    })
    
    updateLeadScore('delivery_calculated', 20)
  },

  installationGuideViewed: (checklistDownloaded: boolean, electricalViewed: boolean) => {
    analytics.track('Installation Research', {
      checklist_downloaded: checklistDownloaded,
      electrical_requirements_viewed: electricalViewed,
      serious_buyer: checklistDownloaded
    })
  },

  // ========== TRUST & SOCIAL PROOF ==========
  reviewEngagement: (rating: number, model: string, helpfulClicked: boolean, timeOnReviews: number) => {
    analytics.track('Review Read', {
      review_rating: rating,
      review_model: model,
      helpful_clicked: helpfulClicked,
      time_on_reviews_seconds: timeOnReviews,
      trust_building: true
    })
  },

  warrantyViewed: (extendedWarrantyInterest: boolean) => {
    analytics.track('Warranty Information Viewed', {
      extended_warranty_interest: extendedWarrantyInterest,
      trust_signal: true
    })
  },

  // ========== HIGH-INTENT ACTIONS ==========
  quoteRequested: (model: string, configuration: any, contactMethod: string) => {
    analytics.track('Quote Requested', {
      model,
      configuration,
      contact_method: contactMethod,
      intent_level: 'ready_to_buy',
      hot_lead: true
    })
    
    updateLeadScore('quote_requested', 35)
    alertSalesTeam('HOT LEAD - Quote Request', { model, contactMethod })
  },

  expertChatStarted: (topic: string, model?: string) => {
    analytics.track('Expert Chat Started', {
      topic,
      model_interest: model,
      intent_level: 'very_high',
      needs_human_touch: true
    })
    
    updateLeadScore('chat_started', 25)
  },

  // ========== CART & CHECKOUT ==========
  cartAbandoned: (value: number, items: any[], abandonmentPoint: string, email?: string) => {
    analytics.track('Cart Abandoned', {
      cart_value: value,
      items,
      abandonment_point: abandonmentPoint,
      email_captured: !!email,
      recovery_possible: !!email
    })
    
    // Store in abandoned_carts table for recovery
    storeAbandonedCart(value, items, email)
  },

  // ========== RETURN VISITOR ==========
  returnVisit: (visitNumber: number, daysSinceFirst: number, source: string) => {
    analytics.track('Return Visit', {
      visit_number: visitNumber,
      days_since_first_visit: daysSinceFirst,
      source,
      buyer_journey_stage: visitNumber >= 3 ? 'decision' : 'evaluation',
      hot_lead: visitNumber >= 3 && daysSinceFirst <= 14
    })
    
    if (visitNumber >= 3) {
      updateLeadScore('multiple_visits', 20)
    }
  }
}

// ========== LEAD SCORING SYSTEM ==========
async function updateLeadScore(action: string, points: number) {
  try {
    // Get current user session
    const sessionId = sessionStorage.getItem('iliosauna_session_id')
    if (!sessionId) return

    // Update or create lead score
    const { data: existingScore } = await supabase
      .from('lead_scores')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (existingScore) {
      const newScore = Math.min(existingScore.score + points, 100)
      const factors = existingScore.scoring_factors || {}
      factors[action] = points

      await supabase
        .from('lead_scores')
        .update({
          score: newScore,
          grade: getGrade(newScore),
          status: getStatus(newScore),
          scoring_factors: factors,
          updated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId)

      // Alert sales if hot lead
      if (newScore > 70 && existingScore.score <= 70) {
        alertSalesTeam('NEW HOT LEAD', { score: newScore, factors })
      }
    } else {
      // Create new lead score
      const factors = { [action]: points }
      await supabase
        .from('lead_scores')
        .insert({
          session_id: sessionId,
          score: points,
          grade: getGrade(points),
          status: getStatus(points),
          scoring_factors: factors
        })
    }
  } catch (error) {
    console.error('Lead scoring error:', error)
  }
}

function getGrade(score: number): string {
  if (score >= 80) return 'A'
  if (score >= 60) return 'B'
  if (score >= 40) return 'C'
  return 'D'
}

function getStatus(score: number): string {
  if (score >= 70) return 'hot'
  if (score >= 40) return 'warm'
  return 'cold'
}

// ========== SALES ALERTS ==========
async function alertSalesTeam(alert: string, data: any) {
  // This would integrate with your CRM or notification system
  console.log(`🔥 SALES ALERT: ${alert}`, data)
  
  // Store alert in database
  await supabase
    .from('sales_alerts')
    .insert({
      alert_type: alert,
      data,
      created_at: new Date().toISOString()
    })
}

// ========== CART RECOVERY ==========
async function storeAbandonedCart(value: number, items: any[], email?: string) {
  const sessionId = sessionStorage.getItem('iliosauna_session_id')
  
  await supabase
    .from('abandoned_carts')
    .insert({
      session_id: sessionId,
      cart_value: value,
      items_count: items.length,
      items,
      email,
      abandoned_at: new Date().toISOString()
    })

  // Schedule recovery email if email provided
  if (email) {
    // This would trigger your email automation
    console.log(`Schedule recovery email for ${email} - Cart value: $${value}`)
  }
}

// ========== AUTO-TRACKING SETUP ==========
export function initializeLuxuryTracking() {
  if (typeof window === 'undefined') return

  // Track scroll depth on pricing pages
  if (window.location.pathname.includes('pricing') || window.location.pathname.includes('sauna')) {
    let maxScroll = 0
    let startTime = Date.now()
    
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      maxScroll = Math.max(maxScroll, scrollPercent)
    })

    window.addEventListener('beforeunload', () => {
      const timeOnPage = (Date.now() - startTime) / 1000
      if (maxScroll > 25) {
        luxuryTracking.pricingViewed(
          'Unknown Model', // You'd extract this from the page
          0, // You'd extract this from the page
          maxScroll,
          timeOnPage
        )
      }
    })
  }

  // Track return visits
  const lastVisit = localStorage.getItem('last_visit')
  const firstVisit = localStorage.getItem('first_visit')
  const visitCount = parseInt(localStorage.getItem('visit_count') || '0')
  
  if (lastVisit) {
    const daysSinceLast = (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24)
    if (daysSinceLast > 0.5) { // More than 12 hours = new visit
      const daysSinceFirst = firstVisit ? (Date.now() - parseInt(firstVisit)) / (1000 * 60 * 60 * 24) : 0
      luxuryTracking.returnVisit(
        visitCount + 1,
        Math.round(daysSinceFirst),
        document.referrer ? new URL(document.referrer).hostname : 'direct'
      )
      localStorage.setItem('visit_count', String(visitCount + 1))
    }
  } else {
    localStorage.setItem('first_visit', String(Date.now()))
    localStorage.setItem('visit_count', '1')
  }
  
  localStorage.setItem('last_visit', String(Date.now()))
}