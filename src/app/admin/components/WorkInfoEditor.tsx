'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

interface PricingPlan {
  title: string;
  description: string;
  price: string;
  features: string[];
  highlighted: boolean;
}

interface WorkProcessStep {
  step: number;
  title: string;
  description: string;
  duration: string;
}

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface WorkInfo {
  headline: string;
  subheadline: string;
  description: string;
  availability: string;
  minBudget: string;
  workingHours: string;
  responseTime: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  pricingPlans: PricingPlan[];
  workProcess: WorkProcessStep[];
  benefits: Benefit[];
  faqs: FAQ[];
}

type TabType = 'general' | 'pricing' | 'process' | 'benefits' | 'faqs';

export default function WorkInfoEditor() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workInfo, setWorkInfo] = useState<WorkInfo>({
    headline: '',
    subheadline: '',
    description: '',
    availability: '',
    minBudget: '',
    workingHours: '',
    responseTime: '',
    email: '',
    phone: '',
    location: '',
    timezone: '',
    pricingPlans: [],
    workProcess: [],
    benefits: [],
    faqs: [],
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchWorkInfo();
  }, []);

  const fetchWorkInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/work-info');
      if (response.ok) {
        const data = await response.json();
        setWorkInfo(data);
      }
    } catch (error) {
      toast.error('Failed to load work info');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/work-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workInfo),
      });

      if (response.ok) {
        toast.success('Work info saved successfully');
      } else {
        toast.error('Failed to save work info');
      }
    } catch (error) {
      toast.error('Failed to save work info');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Pricing Plans handlers
  const addPricingPlan = () => {
    setWorkInfo((prev) => ({
      ...prev,
      pricingPlans: [
        ...prev.pricingPlans,
        { title: '', description: '', price: '', features: [''], highlighted: false },
      ],
    }));
  };

  const removePricingPlan = (index: number) => {
    setWorkInfo((prev) => ({
      ...prev,
      pricingPlans: prev.pricingPlans.filter((_, i) => i !== index),
    }));
  };

  const updatePricingPlan = (index: number, field: keyof PricingPlan, value: string | string[] | boolean) => {
    setWorkInfo((prev) => ({
      ...prev,
      pricingPlans: prev.pricingPlans.map((plan, i) =>
        i === index ? { ...plan, [field]: value } : plan
      ),
    }));
  };

  const addFeatureToPlan = (planIndex: number) => {
    setWorkInfo((prev) => ({
      ...prev,
      pricingPlans: prev.pricingPlans.map((plan, i) =>
        i === planIndex ? { ...plan, features: [...plan.features, ''] } : plan
      ),
    }));
  };

  const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
    setWorkInfo((prev) => ({
      ...prev,
      pricingPlans: prev.pricingPlans.map((plan, i) =>
        i === planIndex
          ? {
              ...plan,
              features: plan.features.map((f, fi) => (fi === featureIndex ? value : f)),
            }
          : plan
      ),
    }));
  };

  const removePlanFeature = (planIndex: number, featureIndex: number) => {
    setWorkInfo((prev) => ({
      ...prev,
      pricingPlans: prev.pricingPlans.map((plan, i) =>
        i === planIndex
          ? { ...plan, features: plan.features.filter((_, fi) => fi !== featureIndex) }
          : plan
      ),
    }));
  };

  // Work Process handlers
  const addWorkProcessStep = () => {
    setWorkInfo((prev) => ({
      ...prev,
      workProcess: [
        ...prev.workProcess,
        { step: prev.workProcess.length + 1, title: '', description: '', duration: '' },
      ],
    }));
  };

  const removeWorkProcessStep = (index: number) => {
    setWorkInfo((prev) => ({
      ...prev,
      workProcess: prev.workProcess
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, step: i + 1 })),
    }));
  };

  const updateWorkProcessStep = (index: number, field: keyof WorkProcessStep, value: string | number) => {
    setWorkInfo((prev) => ({
      ...prev,
      workProcess: prev.workProcess.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    }));
  };

  const moveWorkProcessStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= workInfo.workProcess.length) return;

    setWorkInfo((prev) => {
      const newProcess = [...prev.workProcess];
      [newProcess[index], newProcess[newIndex]] = [newProcess[newIndex], newProcess[index]];
      return {
        ...prev,
        workProcess: newProcess.map((step, i) => ({ ...step, step: i + 1 })),
      };
    });
  };

  // Benefits handlers
  const addBenefit = () => {
    setWorkInfo((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { title: '', description: '', icon: '' }],
    }));
  };

  const removeBenefit = (index: number) => {
    setWorkInfo((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const updateBenefit = (index: number, field: keyof Benefit, value: string) => {
    setWorkInfo((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) =>
        i === index ? { ...benefit, [field]: value } : benefit
      ),
    }));
  };

  // FAQs handlers
  const addFAQ = () => {
    setWorkInfo((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };

  const removeFAQ = (index: number) => {
    setWorkInfo((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    setWorkInfo((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-gray-500 dark:text-gray-400">Loading work info...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Work Info Editor
        </h2>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-linear-to-r from-purple-600 to-blue-600 text-white"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'general'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          General Info
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'pricing'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Pricing Plans
        </button>
        <button
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'process'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Work Process
        </button>
        <button
          onClick={() => setActiveTab('benefits')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'benefits'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Benefits
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'faqs'
              ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          FAQs
        </button>
      </div>

      {/* General Info Tab */}
      {activeTab === 'general' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={workInfo.headline}
                onChange={(e) => setWorkInfo({ ...workInfo, headline: e.target.value })}
                placeholder="Enter headline"
              />
            </div>
            <div>
              <Label htmlFor="subheadline">Subheadline</Label>
              <Input
                id="subheadline"
                value={workInfo.subheadline}
                onChange={(e) => setWorkInfo({ ...workInfo, subheadline: e.target.value })}
                placeholder="Enter subheadline"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={workInfo.description}
              onChange={(e) => setWorkInfo({ ...workInfo, description: e.target.value })}
              placeholder="Enter description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                value={workInfo.availability}
                onChange={(e) => setWorkInfo({ ...workInfo, availability: e.target.value })}
                placeholder="e.g., Available for hire"
              />
            </div>
            <div>
              <Label htmlFor="minBudget">Minimum Budget</Label>
              <Input
                id="minBudget"
                value={workInfo.minBudget}
                onChange={(e) => setWorkInfo({ ...workInfo, minBudget: e.target.value })}
                placeholder="e.g., $5,000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="workingHours">Working Hours</Label>
              <Input
                id="workingHours"
                value={workInfo.workingHours}
                onChange={(e) => setWorkInfo({ ...workInfo, workingHours: e.target.value })}
                placeholder="e.g., 9 AM - 6 PM"
              />
            </div>
            <div>
              <Label htmlFor="responseTime">Response Time</Label>
              <Input
                id="responseTime"
                value={workInfo.responseTime}
                onChange={(e) => setWorkInfo({ ...workInfo, responseTime: e.target.value })}
                placeholder="e.g., Within 24 hours"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={workInfo.email}
                onChange={(e) => setWorkInfo({ ...workInfo, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={workInfo.phone}
                onChange={(e) => setWorkInfo({ ...workInfo, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={workInfo.location}
                onChange={(e) => setWorkInfo({ ...workInfo, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={workInfo.timezone}
                onChange={(e) => setWorkInfo({ ...workInfo, timezone: e.target.value })}
                placeholder="e.g., UTC+3"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pricing Plans Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          {workInfo.pricingPlans.map((plan, planIndex) => (
            <div
              key={planIndex}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => toggleSection(`plan-${planIndex}`)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-lg"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {plan.title || `Plan ${planIndex + 1}`}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {expandedSections[`plan-${planIndex}`] ? '−' : '+'}
                </span>
              </button>
              {expandedSections[`plan-${planIndex}`] && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={plan.title}
                        onChange={(e) => updatePricingPlan(planIndex, 'title', e.target.value)}
                        placeholder="Plan title"
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        value={plan.price}
                        onChange={(e) => updatePricingPlan(planIndex, 'price', e.target.value)}
                        placeholder="e.g., $999"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={plan.description}
                      onChange={(e) =>
                        updatePricingPlan(planIndex, 'description', e.target.value)
                      }
                      placeholder="Plan description"
                      rows={2}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Features</Label>
                      <Button
                        onClick={() => addFeatureToPlan(planIndex)}
                        size="sm"
                        variant="outline"
                      >
                        + Add Feature
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) =>
                              updatePlanFeature(planIndex, featureIndex, e.target.value)
                            }
                            placeholder="Feature description"
                          />
                          <Button
                            onClick={() => removePlanFeature(planIndex, featureIndex)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={plan.highlighted}
                        onChange={(e) =>
                          updatePricingPlan(planIndex, 'highlighted', e.target.checked)
                        }
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Highlighted Plan
                      </span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => removePricingPlan(planIndex)}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:border-red-600"
                    >
                      Delete Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button
            onClick={addPricingPlan}
            className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white"
          >
            + Add Pricing Plan
          </Button>
        </div>
      )}

      {/* Work Process Tab */}
      {activeTab === 'process' && (
        <div className="space-y-4">
          {workInfo.workProcess.map((step, stepIndex) => (
            <div
              key={stepIndex}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => toggleSection(`step-${stepIndex}`)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-lg"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  Step {step.step}: {step.title || 'Untitled'}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {expandedSections[`step-${stepIndex}`] ? '−' : '+'}
                </span>
              </button>
              {expandedSections[`step-${stepIndex}`] && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={step.title}
                        onChange={(e) => updateWorkProcessStep(stepIndex, 'title', e.target.value)}
                        placeholder="Step title"
                      />
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={step.duration}
                        onChange={(e) =>
                          updateWorkProcessStep(stepIndex, 'duration', e.target.value)
                        }
                        placeholder="e.g., 1-2 weeks"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={step.description}
                      onChange={(e) =>
                        updateWorkProcessStep(stepIndex, 'description', e.target.value)
                      }
                      placeholder="Step description"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => moveWorkProcessStep(stepIndex, 'up')}
                      variant="outline"
                      size="sm"
                      disabled={stepIndex === 0}
                    >
                      ↑ Move Up
                    </Button>
                    <Button
                      onClick={() => moveWorkProcessStep(stepIndex, 'down')}
                      variant="outline"
                      size="sm"
                      disabled={stepIndex === workInfo.workProcess.length - 1}
                    >
                      ↓ Move Down
                    </Button>
                    <div className="flex-1" />
                    <Button
                      onClick={() => removeWorkProcessStep(stepIndex)}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:border-red-600"
                    >
                      Delete Step
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button
            onClick={addWorkProcessStep}
            className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white"
          >
            + Add Process Step
          </Button>
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="space-y-4">
          {workInfo.benefits.map((benefit, benefitIndex) => (
            <div
              key={benefitIndex}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => toggleSection(`benefit-${benefitIndex}`)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-lg"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {benefit.title || `Benefit ${benefitIndex + 1}`}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {expandedSections[`benefit-${benefitIndex}`] ? '−' : '+'}
                </span>
              </button>
              {expandedSections[`benefit-${benefitIndex}`] && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={benefit.title}
                        onChange={(e) => updateBenefit(benefitIndex, 'title', e.target.value)}
                        placeholder="Benefit title"
                      />
                    </div>
                    <div>
                      <Label>Icon Name</Label>
                      <Input
                        value={benefit.icon}
                        onChange={(e) => updateBenefit(benefitIndex, 'icon', e.target.value)}
                        placeholder="e.g., check-circle"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={benefit.description}
                      onChange={(e) => updateBenefit(benefitIndex, 'description', e.target.value)}
                      placeholder="Benefit description"
                      rows={2}
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => removeBenefit(benefitIndex)}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:border-red-600"
                    >
                      Delete Benefit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button
            onClick={addBenefit}
            className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white"
          >
            + Add Benefit
          </Button>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          {workInfo.faqs.map((faq, faqIndex) => (
            <div
              key={faqIndex}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => toggleSection(`faq-${faqIndex}`)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-lg"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {faq.question || `FAQ ${faqIndex + 1}`}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {expandedSections[`faq-${faqIndex}`] ? '−' : '+'}
                </span>
              </button>
              {expandedSections[`faq-${faqIndex}`] && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFAQ(faqIndex, 'question', e.target.value)}
                      placeholder="Enter question"
                    />
                  </div>

                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(faqIndex, 'answer', e.target.value)}
                      placeholder="Enter answer"
                      rows={3}
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => removeFAQ(faqIndex)}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:border-red-600"
                    >
                      Delete FAQ
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button
            onClick={addFAQ}
            className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white"
          >
            + Add FAQ
          </Button>
        </div>
      )}
    </div>
  );
}
