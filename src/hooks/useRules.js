import { useState, useEffect } from 'react'
import { RulesService } from '../services/rulesService'
import { useToast } from '../contexts/ToastContext'

export const useRules = () => {
  const [rules, setRules] = useState([])
  const [showRuleEditor, setShowRuleEditor] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const loadRules = async () => {
    try {
      setLoading(true)
      const loadedRules = await RulesService.loadRules()
      setRules(loadedRules)
    } catch (error) {
      console.error('Failed to load rules:', error)
      toast.error('Failed to load rules')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRules()
  }, [])

  const handleCreateRule = () => {
    setEditingRule(null)
    setShowRuleEditor(true)
  }

  const handleEditRule = (rule) => {
    setEditingRule(rule)
    setShowRuleEditor(true)
  }

  const handleDeleteRule = async (ruleId) => {
    try {
      await RulesService.deleteRule(ruleId)
      await loadRules() // Refresh the rules list
      toast.success('Rule deleted successfully')
    } catch (error) {
      console.error('Failed to delete rule:', error)
      toast.error('Failed to delete rule')
    }
  }

  const handleDuplicateRule = async (rule) => {
    try {
      await RulesService.duplicateRule(rule)
      await loadRules() // Refresh the rules list
      toast.success('Rule duplicated successfully')
    } catch (error) {
      console.error('Failed to duplicate rule:', error)
      toast.error('Failed to duplicate rule')
    }
  }

  const handleSaveRule = async (ruleData) => {
    try {
      if (editingRule) {
        await RulesService.updateRule(editingRule.id, ruleData)
        toast.success('Rule updated successfully')
      } else {
        await RulesService.createRule(ruleData)
        toast.success('Rule created successfully')
      }
      await loadRules() // Refresh the rules list
      handleCancelRuleEditor()
    } catch (error) {
      console.error('Failed to save rule:', error)
      toast.error(`Failed to ${editingRule ? 'update' : 'create'} rule`)
    }
  }

  const handleCancelRuleEditor = () => {
    setShowRuleEditor(false)
    setEditingRule(null)
  }

  return {
    rules,
    loading,
    showRuleEditor,
    editingRule,
    handleCreateRule,
    handleEditRule,
    handleDeleteRule,
    handleDuplicateRule,
    handleSaveRule,
    handleCancelRuleEditor,
    loadRules
  }
}