<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'role' => "required|string|max:255",
            'permissions' => "nullable|string|in:product:create,product:read,product:update,product:delete,user:create,user:read,user:update,user:delete",
            'isAdmin' => "required|boolean"
        ];
    }
}
