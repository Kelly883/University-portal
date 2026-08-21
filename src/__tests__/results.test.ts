import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyTransition,
  transitionPermission,
  isEditable,
  requiresAudit,
  type ResultStatus,
} from "../lib/results.ts";

test("enter only allowed before approval", () => {
  assert.equal(applyTransition("DRAFT", "enter").ok, true);
  assert.equal(applyTransition("SUBMITTED", "enter").ok, true);
  assert.equal(applyTransition("APPROVED", "enter").ok, false);
  assert.equal(applyTransition("PUBLISHED", "enter").ok, false);
});

test("happy path DRAFT -> SUBMITTED -> APPROVED -> PUBLISHED", () => {
  let s: ResultStatus = "DRAFT";
  s = applyTransition(s, "submit").next!;
  assert.equal(s, "SUBMITTED");
  s = applyTransition(s, "approve").next!;
  assert.equal(s, "APPROVED");
  s = applyTransition(s, "publish").next!;
  assert.equal(s, "PUBLISHED");
});

test("cannot skip steps", () => {
  assert.equal(applyTransition("DRAFT", "approve").ok, false);
  assert.equal(applyTransition("DRAFT", "publish").ok, false);
  assert.equal(applyTransition("SUBMITTED", "publish").ok, false);
  assert.equal(applyTransition("APPROVED", "submit").ok, false);
});

test("reopen sends approved/published back to DRAFT", () => {
  assert.equal(applyTransition("APPROVED", "reopen").next, "DRAFT");
  assert.equal(applyTransition("PUBLISHED", "reopen").next, "DRAFT");
  assert.equal(applyTransition("DRAFT", "reopen").ok, false);
});

test("permissions map to granular PRD permissions", () => {
  assert.equal(transitionPermission("enter"), "results.enter");
  assert.equal(transitionPermission("submit"), "results.enter");
  assert.equal(transitionPermission("approve"), "results.approve");
  assert.equal(transitionPermission("publish"), "results.publish");
  assert.equal(transitionPermission("reopen"), "results.approve");
});

test("editable state and audit requirements", () => {
  assert.equal(isEditable("DRAFT"), true);
  assert.equal(isEditable("SUBMITTED"), true);
  assert.equal(isEditable("APPROVED"), false);
  assert.equal(isEditable("PUBLISHED"), false);
  assert.equal(requiresAudit("publish"), true);
  assert.equal(requiresAudit("reopen"), true);
  assert.equal(requiresAudit("enter"), false);
});
